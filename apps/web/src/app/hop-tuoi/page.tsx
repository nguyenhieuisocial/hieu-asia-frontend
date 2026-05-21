import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = {
  title: 'Hợp Tuổi — Xem tương hợp Can Chi | hieu.asia',
  description:
    'Xem hợp tuổi miễn phí cho cưới hỏi, hợp tác kinh doanh, sinh con, xông đất. Phân tích Thiên Can, Địa Chi, Tam hợp, Tứ hành xung, Cung Phi 8 trạch.',
};

const CARDS = [
  {
    href: '/hop-tuoi/wedding',
    title: 'Cưới hỏi',
    emoji: '💍',
    desc: 'Xem hợp tuổi vợ chồng — Thiên Can, Địa Chi, Cung Phi.',
  },
  {
    href: '/hop-tuoi/business',
    title: 'Hợp tác kinh doanh',
    emoji: '🤝',
    desc: 'Đánh giá tương hợp đối tác, tập trung cung Tài Quan.',
  },
  {
    href: '/hop-tuoi/birth-child',
    title: 'Sinh con',
    emoji: '👶',
    desc: 'Chọn năm sinh con hợp với tuổi cha mẹ.',
  },
  {
    href: '/hop-tuoi/xong-dat',
    title: 'Xông đất',
    emoji: '🎋',
    desc: 'Chọn người xông đất đầu năm phù hợp gia chủ.',
  },
];

export default function HopTuoiLandingPage() {
  return (
    <main className="min-h-screen bg-ink-radial">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl font-semibold text-gold">
          hieu.asia
        </Link>
      </header>

      <section className="container mx-auto max-w-5xl px-6 pb-20 pt-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-gold md:text-5xl">Hợp Tuổi</h1>
          <p className="mt-3 text-cream/70">
            Xem tương hợp Can Chi theo từng việc cụ thể — miễn phí, tức thì.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} className="block transition hover:scale-[1.02]">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <span aria-hidden className="text-3xl">
                      {c.emoji}
                    </span>
                    {c.title}
                  </CardTitle>
                  <CardDescription>{c.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-gold">Bắt đầu →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-cream/40">
          Công cụ tham khảo — không thay thế tư vấn chuyên gia. Quyết định cuối cùng thuộc về bạn.
        </p>
      </section>
    </main>
  );
}

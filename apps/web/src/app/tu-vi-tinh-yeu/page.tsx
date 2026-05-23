import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { Heart, MessageCircle, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

export const metadata: Metadata = {
  title: 'Tử Vi tình yêu: kiểu gắn bó, nhu cầu cảm xúc, mẫu xung đột',
  description:
    'Tử Vi tình cảm — đọc cung Phu Thê, Phúc Đức + tâm lý gắn bó hiện đại. Không phán "hợp/khắc tuyệt đối", chỉ giúp hiểu chính mình và đối tác.',
  alternates: { canonical: 'https://hieu.asia/tu-vi-tinh-yeu' },
  openGraph: {
    title: 'Tử Vi tình yêu',
    description: 'Phu Thê + Phúc Đức + kiểu gắn bó — bản đồ quan hệ thân mật.',
    url: 'https://hieu.asia/tu-vi-tinh-yeu',
    type: 'article',
  },
};

const PATTERNS = [
  {
    icon: Heart,
    title: 'Cần an toàn cảm xúc + sự nhất quán',
    body: 'Phu Thê có Thái Âm/Thiên Đồng — bạn dễ vướng người trầm tính, sâu sắc. Rủi ro: dễ "im lặng = đồng ý" và giữ trong lòng quá lâu.',
  },
  {
    icon: Users,
    title: 'Hợp người sôi nổi + có sức ảnh hưởng',
    body: 'Phu Thê có Thái Dương/Tham Lang — bạn dễ rung động với người năng động. Cẩn trọng nếu hai bên cùng "high energy" mà không có người làm điểm cân bằng.',
  },
  {
    icon: MessageCircle,
    title: 'Kết nối qua trí tuệ + giao tiếp',
    body: 'Phu Thê có Thiên Cơ/Cự Môn — gắn bó qua đối thoại sâu. Rủi ro: tranh luận leo thang nếu hai bên đều "thắng cuộc".',
  },
  {
    icon: ShieldAlert,
    title: 'Phu Thê có Hoá Kỵ/sát tinh',
    body: 'Không phải "không có duyên". Là tín hiệu cần học giao tiếp kỳ vọng SỚM và rõ. Nhiều người có Phu Thê khó vẫn có hôn nhân hạnh phúc khi học được kỹ năng giao tiếp.',
  },
];

const DOS_DONTS = [
  {
    do: 'Đọc cung Phu Thê CỦA BẠN để hiểu khuôn mẫu chính bạn dễ rơi vào.',
    dont: 'KHÔNG dùng cung Phu Thê để "kiểm tra" người yêu — đó là vi phạm quyền riêng tư.',
  },
  {
    do: 'Đối chiếu với cung Phúc Đức để biết "kỳ vọng quan hệ" có thực tế không.',
    dont: 'KHÔNG kết luận "hợp/khắc tuyệt đối" — quan hệ là quá trình hai bên cùng học.',
  },
  {
    do: 'Khi gặp lưu niên xung Phu Thê, học cách giao tiếp kỳ vọng RÕ và sớm.',
    dont: 'KHÔNG hỏi Mentor "tôi có nên ly hôn ngay không?" — Mentor sẽ từ chối quyết định thay bạn.',
  },
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tử Vi tình yêu', item: 'https://hieu.asia/tu-vi-tinh-yeu' },
  ],
};

export default function TuViTinhYeuPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />

      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Tử Vi · Tình cảm & quan hệ thân mật
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Tử Vi tình yêu — không phán hợp/khắc, chỉ giúp hiểu mình
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Cung Phu Thê không nói "ai là người định mệnh của bạn". Nó mô tả KIỂU gắn bó
            bạn dễ rơi vào, nhu cầu cảm xúc cốt lõi, và rủi ro giao tiếp dễ gặp. hieu.asia
            kết hợp Tử Vi với khung tâm lý gắn bó hiện đại để giúp bạn hiểu CHÍNH BẠN
            trong quan hệ — không phải để "đoán" đối tác.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/onboarding">
              Xem tử vi tình cảm của tôi
            </Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/tu-vi/cung-phu-the">
              
                Cung Phu Thê là gì
              
            </Link></Button>
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            4 khuôn mẫu quan hệ thường gặp
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PATTERNS.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.title} className="border-border bg-card/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start gap-2 font-heading text-base text-foreground">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                      {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-5 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Nên / Không nên
          </h2>
          <div className="space-y-3">
            {DOS_DONTS.map((d, i) => (
              <Card key={i} className="border-border bg-card/40">
                <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-jade-50">
                      Nên
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{d.do}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-red-300">
                      Không nên
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{d.dont}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative mx-auto max-w-3xl px-6 pb-20">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem cung Phu Thê CỦA BẠN
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              Bạn sẽ thấy chính tinh tại Phu Thê, tứ hoá, và tam phương tứ chính (Phu Thê +
              Phúc Đức + Tật Ách + Quan Lộc). Mentor sẽ giúp bạn dịch chúng thành "tôi cần
              gì trong quan hệ" và "tôi dễ gặp rủi ro giao tiếp gì".
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/onboarding">
                Lập lá số miễn phí
              </Link></Button>
              <Link
                href="/hop-tuoi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Xem hợp tuổi cưới hỏi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

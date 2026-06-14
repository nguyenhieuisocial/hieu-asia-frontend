import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { cardOfTheDay } from '@/lib/tools/tarot';

// Render mỗi request với ngày hiện tại (giờ VN) → luôn đúng "lá hôm nay".
export const dynamic = 'force-dynamic';

// Metadata riêng — nếu không khai báo, trang thừa kế canonical /tarot từ layout cha
// và tự loại mình khỏi index.
export const metadata: Metadata = {
  title: 'Lá Tarot hôm nay — mỗi ngày một lá để ngẫm | hieu.asia',
  description:
    'Mỗi ngày một lá Tarot chung cho mọi người (theo giờ Việt Nam) kèm câu hỏi tự soi. Không tiên đoán vận ngày — chỉ là một phút dừng lại để ngẫm. Miễn phí.',
  alternates: { canonical: 'https://hieu.asia/tarot/hom-nay' },
  openGraph: {
    title: 'Lá Tarot hôm nay — mỗi ngày một lá để ngẫm | hieu.asia',
    description: 'Mỗi ngày một lá Tarot kèm câu hỏi tự soi — không tiên đoán, chỉ là một phút dừng lại.',
    url: 'https://hieu.asia/tarot/hom-nay',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const FAQS = [
  {
    q: 'Lá Tarot hôm nay được chọn như thế nào?',
    a: 'Theo ngày (giờ Việt Nam): hệ thống trộn bộ 78 lá bằng thuật toán ngẫu nhiên lấy chính ngày hôm đó làm hạt giống, nên suốt cả ngày chỉ có một lá và ai mở trang cũng thấy giống nhau; sang ngày mới lá tự đổi. Không ai "chọn tay" lá để dẫn dắt bạn cả.',
  },
  {
    q: 'Lá hôm nay có phải là vận mệnh ngày của tôi không?',
    a: 'Không. Cùng một lá hiện ra cho tất cả mọi người thì không thể là chuyện riêng của ai. Nó chỉ là một lời nhắc trung lập để bạn dừng lại một phút — điều có ý nghĩa là cách bạn liên hệ lá với chuyện của chính mình.',
  },
  {
    q: 'Muốn rút lá cho câu hỏi riêng thì làm thế nào?',
    a: 'Sang trang Rút bài Tarot, đặt một câu hỏi cụ thể đang phân vân rồi rút bài theo kiểu trải phù hợp; nếu muốn, bạn có thể đọc sâu cùng AI dựa trên bối cảnh bạn mô tả.',
  },
];

const REFLECT = [
  'Lá này khiến bạn liên tưởng tới điều gì đang diễn ra với mình lúc này?',
  'Nếu lấy nó làm lời nhắc, hôm nay bạn muốn làm khác đi một điều nhỏ nào?',
  'Có điều gì bạn đang ngại nghĩ tới mà lá này vô tình chạm vào không?',
];

export default function TarotTodayPage() {
  const { drawn, dateLabel } = cardOfTheDay();
  const { card, orientation } = drawn;
  const meaning = orientation === 'upright' ? card.up : card.rev;
  const kind = card.arcana === 'major' ? 'Ẩn chính' : `Ẩn phụ · ${card.suit}`;

  return (
    <ToolPageShell
      eyebrow="TAROT PHẢN TƯ · MỖI NGÀY"
      relatedSlug="/tarot"
      icon="🌅"
      title={<>Lá Tarot <GoldAccent>hôm nay</GoldAccent></>}
      description="Mỗi ngày một lá — chung cho tất cả mọi người. Đây không phải lời tiên đoán về ngày của bạn, mà là một lá để bạn dừng lại và ngẫm. Ý nghĩa nằm ở điều chính bạn soi thấy."
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Tarot', href: '/tarot' }, { label: 'Hôm nay' }]}
    >
      <div className="mx-auto max-w-2xl">
        <p className="text-center font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Ngày {dateLabel}
        </p>

        <div className="mt-4 rounded-xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">Lá của ngày</span>
            <span className="font-mono text-xs capitalize text-muted-foreground">{kind}</span>
          </div>
          <h2 className="mt-1 font-heading text-3xl font-bold text-foreground">
            {card.name_vi}{' '}
            <span className="text-base font-normal text-muted-foreground">
              · {orientation === 'upright' ? 'xuôi' : 'ngược'}
            </span>
          </h2>
          <p className="mt-3 leading-relaxed text-foreground/90">{meaning}</p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card/40 p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Vài câu để bạn tự soi
          </div>
          <ul className="mt-3 space-y-2">
            {REFLECT.map((q) => (
              <li key={q} className="flex gap-2 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden className="text-gold">·</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Cùng một lá cho mọi người trong ngày — nên nó <b className="text-foreground/80">không nói riêng về số phận của bạn</b>.
          Tarot ở đây chỉ là cái cớ để dừng lại suy ngẫm; điều có ý nghĩa là cách bạn liên hệ nó với đời mình. Không bói toán, không tiên đoán.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/tarot"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Rút quẻ cho câu hỏi riêng của bạn →
          </Link>
          <Link
            href="/onboarding"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            Ghép với Tử Vi + Bát Tự của tôi →
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ghé lại mỗi ngày để gặp một lá mới · <Link href="/tu-kiem" className="text-gold hover:underline">Vì sao mình không bói mù?</Link>
        </p>

        <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Câu hỏi thường gặp</h2>
          <dl className="mt-4 space-y-4">
            {FAQS.map((f, i) => (
              <div key={i}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <JsonLd data={faqPage(FAQS)} />
      <StickyMobileCta trackId="tarot-hom-nay" />
    </ToolPageShell>
  );
}

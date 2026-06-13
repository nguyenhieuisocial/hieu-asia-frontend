import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import {
  allPairSlugs,
  parsePairSlug,
  relationOf,
  canonicalPairSlug,
  nguHanhInteraction,
  RELATION_COPY,
  type RelationKind,
  type Zodiac,
} from '@/lib/hop-tuoi-pairs';

const BASE = 'https://hieu.asia';

export function generateStaticParams() {
  return allPairSlugs().map((cap) => ({ cap }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cap: string }>;
}): Promise<Metadata> {
  const { cap } = await params;
  const parsed = parsePairSlug(cap);
  if (!parsed) return {};
  const { a, b } = parsed;
  const copy = RELATION_COPY[relationOf(a.slug, b.slug)];
  const title = `Tuổi ${a.ten} hợp tuổi ${b.ten} không? — Luận giải Can Chi`;
  const description = copy.summary(a.ten, b.ten).slice(0, 200);
  const canonical = `${BASE}/hop-tuoi/tuoi/${canonicalPairSlug(a.slug, b.slug)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `Tuổi ${a.ten} và tuổi ${b.ten} — Hợp tuổi`,
      description,
      url: canonical,
      type: 'article',
    },
  };
}

/** Gợi ý khi đi cùng nhau — theo loại quan hệ, on-brand (xây dựng, không hù doạ). */
const GUIDANCE: Record<RelationKind, string> = {
  'tam-hop':
    'Nền tảng con giáp là điểm cộng cho việc cưới hỏi hay hợp tác — hãy tận dụng sự ăn ý bằng cách cùng đặt mục tiêu rõ ràng và phân vai theo thế mạnh mỗi người.',
  'luc-hop':
    'Đây là cặp dễ bổ trợ nhau. Khi cưới hỏi hay làm ăn, hãy biến sự bổ sung đó thành lợi thế: một người mạnh chiến lược, một người mạnh thực thi chẳng hạn.',
  'luc-xung':
    'Khác nhịp không có nghĩa là không đi cùng được. Hãy thống nhất cách giao tiếp, nhường nhịn đúng lúc và xem khác biệt là sự bổ sung — rất nhiều cặp nhóm này vẫn bền vững.',
  'luc-hai':
    'Điểm cần là tránh hiểu lầm: nói rõ kỳ vọng, kiên nhẫn và đặt sự chân thành lên trước. Khác biệt được xử lý xây dựng sẽ không còn là rào cản.',
  'dong-tuoi':
    'Cùng tuổi nên dễ đồng cảm và bắt nhịp. Hãy chủ động bù đắp ở những điểm cả hai cùng yếu để không khuếch đại nhược điểm chung.',
  'binh-hoa':
    'Con giáp không tạo lực hút hay lực đẩy nổi bật, nên kết quả gần như nằm trọn trong tay hai người: giá trị chung, giao tiếp thẳng thắn và đồng hành.',
};

function buildFaqs(
  a: Zodiac,
  b: Zodiac,
  kind: RelationKind,
): { q: string; a: string }[] {
  const copy = RELATION_COPY[kind];
  const positive = kind === 'tam-hop' || kind === 'luc-hop';
  const caution = kind === 'luc-xung' || kind === 'luc-hai';
  return [
    {
      q: `Tuổi ${a.ten} và tuổi ${b.ten} có hợp nhau không?`,
      a:
        copy.summary(a.ten, b.ten) +
        ' Đây là góc nhìn tổng quan theo con giáp để tham khảo; sự hợp nhau thật sự phụ thuộc vào con người và lá số chi tiết theo năm sinh, không phải chỉ ở tuổi.',
    },
    {
      q: caution
        ? `Tuổi ${a.ten} và tuổi ${b.ten} có cưới hỏi / làm ăn cùng nhau được không?`
        : `Tuổi ${a.ten} và tuổi ${b.ten} hợp cưới hỏi hay làm ăn hơn?`,
      a: positive
        ? `Đây là nền tảng thuận lợi cho cả cưới hỏi lẫn hợp tác. ${GUIDANCE[kind]}`
        : caution
          ? `Hoàn toàn được. Nhóm này chỉ gợi ý cần dung hoà nhiều hơn, không phải "tránh nhau". ${GUIDANCE[kind]}`
          : `Được — và phần lớn phụ thuộc vào hai người. ${GUIDANCE[kind]}`,
    },
    {
      q: 'Làm sao biết chính xác hai tuổi có hợp theo năm sinh?',
      a: 'Hãy dùng công cụ hợp tuổi chi tiết tại hieu.asia/hop-tuoi — phân tích Thiên Can, Địa Chi và Ngũ Hành theo đúng năm sinh của hai người, thay vì chỉ xét con giáp.',
    },
  ];
}

export default async function HopTuoiPairPage({
  params,
}: {
  params: Promise<{ cap: string }>;
}) {
  const { cap } = await params;
  const parsed = parsePairSlug(cap);
  if (!parsed) notFound();
  const { a, b } = parsed;
  const kind = relationOf(a.slug, b.slug);
  const copy = RELATION_COPY[kind];
  const nh = nguHanhInteraction(a, b);
  const url = `/hop-tuoi/tuoi/${a.slug}-${b.slug}`;
  const faqs = buildFaqs(a, b, kind);

  const toneClass =
    kind === 'tam-hop' || kind === 'luc-hop'
      ? 'border-jade/40 bg-jade/[0.06]'
      : kind === 'luc-xung' || kind === 'luc-hai'
        ? 'border-amber-400/40 bg-amber-500/[0.06]'
        : 'border-gold/30 bg-gold/[0.05]';

  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: `Tuổi ${a.ten} hợp tuổi ${b.ten} không?`,
            description: copy.summary(a.ten, b.ten),
            url,
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Hợp tuổi', url: '/hop-tuoi' },
            { name: 'Theo con giáp', url: '/hop-tuoi/tuoi' },
            { name: `Tuổi ${a.ten} – ${b.ten}`, url },
          ]),
          faqPage(faqs),
        ]}
      />
      <ToolPageShell
        eyebrow={`Hợp tuổi · ${a.ten} & ${b.ten}`}
        icon={
          <span aria-hidden="true">
            {a.emoji}
            {b.emoji}
          </span>
        }
        title={
          <>
            Tuổi {a.ten} và tuổi <GoldAccent>{b.ten}</GoldAccent>
          </>
        }
        description={copy.summary(a.ten, b.ten)}
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hợp tuổi', href: '/hop-tuoi' },
          { label: 'Theo con giáp', href: '/hop-tuoi/tuoi' },
          { label: `${a.ten} – ${b.ten}` },
        ]}
      >
        {/* Kết luận quan hệ */}
        <section className={`mt-8 rounded-2xl border p-6 sm:p-8 ${toneClass}`}>
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Quan hệ Can Chi
          </div>
          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {copy.label}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/85 sm:text-base">
            {copy.detail(a.ten, b.ten)}
          </p>
        </section>

        {/* Chia sẻ + thách bạn */}
        <div className="mt-6 rounded-xl border border-border bg-card/40 p-5">
          <p className="text-sm font-medium text-foreground">
            Thách người ấy tự xem kết quả — gửi link này cho họ nhé!
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Họ sẽ thấy đúng kết quả hai tuổi này và có thể tự xem hợp tuổi của chính mình.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ShareResultButton
              path={url}
              title={`Tuổi ${a.ten} và tuổi ${b.ten} có hợp nhau không?`}
              text={`Mình vừa xem hai tuổi ${a.ten} và ${b.ten} — ${copy.label.toLowerCase()}. Bạn thử xem hợp tuổi của mình nhé!`}
              trackId="hop-tuoi-cap"
              label="Gửi kết quả cho bạn"
            />
            <ShareResultButton
              path="/hop-tuoi"
              title="Xem hợp tuổi cưới hỏi, làm ăn — hieu.asia"
              text="Thách bạn tự xem hợp tuổi của mình trên hieu.asia — miễn phí, không phán mù!"
              trackId="hop-tuoi-cap-challenge"
              label="Thách bạn tự xem"
            />
          </div>
        </div>

        {/* Tính cách hai con giáp */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Tính cách hai con giáp">
          {[a, b].map((z) => (
            <div key={z.slug} className="rounded-xl border border-border bg-card/40 p-5">
              <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <span aria-hidden className="text-xl">
                  {z.emoji}
                </span>
                Tuổi {z.ten}{' '}
                <span className="font-mono text-xs font-normal text-muted-foreground">
                  ({z.nguHanh})
                </span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{z.blurb}</p>
            </div>
          ))}
        </section>

        {/* Ngũ hành */}
        <section className="mt-8 rounded-xl border border-border bg-card/40 p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Tương tác Ngũ Hành
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {nh.text}
          </p>
        </section>

        {/* Gợi ý đi cùng nhau */}
        <section className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Gợi ý khi đi cùng nhau
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {GUIDANCE[kind]}
          </p>
        </section>

        {/* CTA — phễu sang công cụ chính */}
        <section className="mt-10">
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Xem chính xác theo năm sinh
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              Bảng theo con giáp chỉ là góc nhìn tổng quan. Để phân tích đầy đủ Thiên Can,
              Địa Chi và Ngũ Hành theo đúng năm sinh của hai người, hãy dùng công cụ hợp tuổi
              chi tiết — hoặc xem độ hợp cho cả nhóm từ ba người trở lên.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/hop-tuoi"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Xem hợp tuổi theo năm sinh
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/hop-tuoi/tuoi"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
              >
                Tra cặp con giáp khác
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Banner cho người nhận link — CTA lan truyền */}
        <section className="mt-10 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/[0.07] to-transparent p-5 sm:p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-gold/70">Nhận link này từ bạn bè?</p>
          <h2 className="mt-1 font-heading text-lg font-bold text-foreground sm:text-xl">
            Tự xem hợp tuổi của chính bạn — miễn phí
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/75">
            Đây là kết quả hai tuổi bạn vừa xem. Muốn biết tuổi của <em>bạn</em> hợp với tuổi người kia không?
            Chọn việc cần xem — cưới hỏi, hợp tác kinh doanh, sinh con — và nhận luận giải theo năm sinh thật.
          </p>
          <Link
            href="/hop-tuoi"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Xem hợp tuổi của tôi
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-label="Câu hỏi thường gặp">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Câu hỏi thường gặp
          </h2>
          <div className="mt-4 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card/40 p-5">
                <h3 className="font-semibold text-foreground">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-foreground/40">
          Tham khảo tổng quan theo con giáp — không bói toán, không quyết định số phận.
          Yếu tố con người và lá số chi tiết theo năm sinh quan trọng hơn.
        </p>
      </ToolPageShell>
    </>
  );
}

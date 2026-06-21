import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';

export const metadata = {
  title: 'Hợp tuổi cưới hỏi, làm ăn, sinh con — Phân tích AI',
  description:
    'Xem hợp tuổi miễn phí cho cưới hỏi, hợp tác kinh doanh, sinh con, xông đất. Hiểu rõ Tam Hợp, Lục Hợp, Lục Xung, Lục Hại và ngũ hành — minh bạch từng quy tắc, không phán mù.',
  alternates: { canonical: 'https://hieu.asia/hop-tuoi' },
  openGraph: {
    title: 'Hợp tuổi cưới hỏi, làm ăn, sinh con',
    description:
      'Tương hợp Can Chi theo từng việc cụ thể — Tam Hợp, Lục Hợp, Tứ Hành Xung. Miễn phí.',
    url: 'https://hieu.asia/hop-tuoi',
    type: 'website' as const,
  },
};

const HOP_TUOI_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Hợp tuổi · Tương hợp Can Chi',
  provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
  areaServed: 'VN',
  inLanguage: 'vi-VN',
  url: 'https://hieu.asia/hop-tuoi',
  description:
    'Xem hợp tuổi cho cưới hỏi, hợp tác kinh doanh, sinh con, xông đất theo Thiên Can - Địa Chi.',
};

const CARDS = [
  {
    href: '/xem-tuoi-cuoi',
    title: 'Cưới hỏi',
    emoji: '💍',
    desc: 'Năm cưới đẹp (Kim Lâu, Tam Tai) + hợp tuổi vợ chồng (Thiên Can, Địa Chi, Cung Phi) — trong một trang.',
  },
  {
    href: '/hop-tuoi/business',
    title: 'Hợp tác kinh doanh',
    emoji: '🤝',
    desc: 'Đánh giá tương hợp đối tác, tập trung cung Tài Quan và Ngũ Hành.',
  },
  {
    href: '/hop-tuoi/birth-child',
    title: 'Sinh con',
    emoji: '👶',
    desc: 'Chọn năm sinh con hợp với tuổi cha mẹ theo Tam Hợp / Lục Hợp.',
  },
  {
    href: '/hop-tuoi/xong-dat',
    title: 'Xông đất',
    emoji: '🎋',
    desc: 'Chọn người xông đất đầu năm phù hợp với gia chủ.',
  },
];

/**
 * Các quan hệ tuổi theo Can Chi — nội dung giáo dục cho hub. Các nhóm/cặp là
 * tri thức Can Chi cổ điển (cố định, khớp `lib/hop-tuoi-pairs.ts`). Giọng
 * thương hiệu: minh bạch quy tắc, KHÔNG hù doạ — "xung/hại" diễn đạt theo hướng
 * dung hoà (khác nhịp, cần thấu hiểu), không phải lời phán tránh nhau.
 */
const RELATIONS: { label: string; tone: 'hop' | 'luu-y'; groups: string; blurb: string }[] = [
  {
    label: 'Tam Hợp',
    tone: 'hop',
    groups: 'Thân–Tý–Thìn · Dần–Ngọ–Tuất · Tỵ–Dậu–Sửu · Hợi–Mão–Mùi',
    blurb:
      'Bốn nhóm ba con giáp "cùng nhịp", thường dễ tìm tiếng nói chung và hỗ trợ nhau. Đây là tín hiệu tham khảo tích cực — nhưng một mối quan hệ bền vẫn dựa vào cách hai người lắng nghe nhau, hơn là chỉ ở con giáp.',
  },
  {
    label: 'Lục Hợp',
    tone: 'hop',
    groups: 'Tý–Sửu · Dần–Hợi · Mão–Tuất · Thìn–Dậu · Tỵ–Thân · Ngọ–Mùi',
    blurb:
      'Sáu cặp con giáp bổ trợ cho nhau: điểm mạnh của người này có thể cân bằng điểm yếu của người kia. Một gợi ý tham khảo dễ chịu cho sự gắn kết.',
  },
  {
    label: 'Lục Xung',
    tone: 'luu-y',
    groups: 'Tý–Ngọ · Sửu–Mùi · Dần–Thân · Mão–Dậu · Thìn–Tuất · Tỵ–Hợi',
    blurb:
      'Sáu cặp "khác nhịp" — KHÔNG có nghĩa là không thể đi cùng nhau, chỉ gợi ý hai người có cách phản ứng khác nhau nên đôi khi dễ va chạm. Rất nhiều cặp "xung" vẫn rất bền khi cả hai chủ động hiểu và nhường nhịn đúng lúc.',
  },
  {
    label: 'Lục Hại',
    tone: 'luu-y',
    groups: 'Tý–Mùi · Sửu–Ngọ · Dần–Tỵ · Mão–Thìn · Thân–Hợi · Dậu–Tuất',
    blurb:
      'Sáu cặp dễ hiểu lầm nhau ở vài điểm, nên cần giao tiếp rõ ràng và kiên nhẫn hơn. Đây không phải lời cảnh báo "tránh nhau" — cốt lõi vẫn là sự chân thành của hai người.',
  },
];

const FAQS = [
  {
    q: 'Xem hợp tuổi dựa trên những gì?',
    a: 'Trên hệ Can Chi: quan hệ giữa hai Địa Chi (con giáp) — Tam Hợp, Lục Hợp được xem là hợp; Lục Xung, Lục Hại là cần dung hoà — kết hợp với Thiên Can và tương sinh/tương khắc Ngũ Hành của hai tuổi. Với việc cưới hỏi và làm nhà còn xét thêm Cung Phi (Bát Trạch). Tất cả là quy tắc cổ điển, tính ra được — chúng tôi nêu đúng quy tắc kèm cách hiểu lành mạnh, không phán mù.',
  },
  {
    q: 'Hai tuổi "xung" hay "khắc" thì có nên ở cạnh nhau không?',
    a: 'Hoàn toàn nên, nếu hai người thật lòng muốn. "Xung – khắc" trong Can Chi chỉ mô tả hai cá tính khác nhịp, không phải lời phán về phúc hoạ. Rất nhiều cặp vợ chồng, đối tác thuộc nhóm này vẫn hoà thuận, bền lâu khi biết lắng nghe và bổ sung cho nhau. Con giáp chỉ là một lát cắt nhỏ.',
  },
  {
    q: 'Hợp tuổi quan trọng đến đâu khi cưới?',
    a: 'Nó là một yếu tố tham khảo về mặt phong tục, giúp gia đình thêm an tâm — không phải điều kiện quyết định hạnh phúc. Sự thấu hiểu, tôn trọng và cùng vun đắp của hai người mới là cái gốc. Nếu lịch linh hoạt, có thể tham khảo thêm ngày giờ tốt; nếu không, đừng để chuyện tuổi tác làm bạn lo lắng quá mức.',
  },
  {
    q: 'Tính theo tuổi âm hay tuổi dương?',
    a: 'Theo năm sinh ÂM lịch (đúng quy ước dân gian). Người sinh vào tháng 1–2 dương lịch, trước mùng 1 Tết, thuộc con giáp của năm âm liền trước — nên kiểm tra kỹ mốc Tết của năm sinh.',
  },
  {
    q: 'Có cần xem cả ngũ hành không?',
    a: 'Ngũ hành (Kim – Mộc – Thủy – Hỏa – Thổ) là lớp thứ hai bổ sung cho quan hệ con giáp: tương sinh là nâng đỡ, tương khắc là lời nhắc dung hoà. Hai lớp này kết hợp cho bức tranh đầy đủ hơn, nhưng cũng chỉ mang tính tham khảo.',
  },
  {
    q: 'Công cụ này có thay thầy xem tuổi không?',
    a: 'Không, và cũng không cố thay. Chúng tôi minh bạch hoá các quy tắc Can Chi để bạn tự hiểu và cân nhắc — thay vì nghe một lời phán mà không biết vì sao. Quyết định cuối cùng luôn thuộc về bạn.',
  },
];

export default function HopTuoiLandingPage() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(HOP_TUOI_JSONLD) }}
    />
    <JsonLd data={faqPage(FAQS)} />
    <ToolPageShell
      eyebrow="Hợp tuổi · Tương hợp Can Chi"
        relatedSlug="/hop-tuoi"
      icon={<span aria-hidden="true">☯</span>}
      title={
        <>
          Xem <GoldAccent>Hợp Tuổi</GoldAccent>
        </>
      }
      description="Tương hợp Can Chi theo từng việc cụ thể — Thiên Can, Địa Chi, Tam Hợp, Lục Hợp, Tứ Hành Xung. Miễn phí, tức thì."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Hợp tuổi' },
      ]}
    >
      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Chọn việc cần xem hợp tuổi
      </h2>
      <section
        className="mt-6 grid gap-4 sm:grid-cols-2"
        aria-label="Danh sách công cụ xem hợp tuổi"
      >
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-xl"
          >
            <Card className="relative h-full overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/40 group-hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.45)]">
              {/* Subtle gradient corner accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/15 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                  <span aria-hidden className="text-3xl">
                    {c.emoji}
                  </span>
                  {c.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">{c.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold-700 transition-transform group-hover:gap-2">
                  Bắt đầu
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Các quan hệ tuổi theo Can Chi — lớp "nói có sách" */}
      <section className="mt-12" aria-label="Các quan hệ tuổi theo Can Chi">
        <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Các quan hệ tuổi theo Can Chi
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Xem hợp tuổi không phải lời phán mù. Bên dưới là chính các quy tắc Can Chi mà mọi kết quả
          dựa vào — để bạn tự hiểu vì sao, thay vì chỉ nghe &quot;hợp&quot; hay &quot;khắc&quot;.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {RELATIONS.map((r) => (
            <div
              key={r.label}
              className={`rounded-xl border p-4 ${
                r.tone === 'hop'
                  ? 'border-emerald-300/60 bg-emerald-50/40 dark:border-emerald-800/60 dark:bg-emerald-950/15'
                  : 'border-amber-300/60 bg-amber-50/40 dark:border-amber-800/60 dark:bg-amber-950/15'
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-heading text-base font-semibold text-foreground">{r.label}</h3>
                <span
                  className={`text-xs font-medium ${
                    r.tone === 'hop'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {r.tone === 'hop' ? 'Hợp' : 'Cần dung hoà'}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-foreground/70">{r.groups}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.blurb}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Lớp thứ hai là <strong className="text-foreground">Ngũ Hành</strong> của hai tuổi (Kim –
          Mộc – Thủy – Hỏa – Thổ): tương sinh là nâng đỡ tự nhiên, tương khắc là lời nhắc dung hoà.
          Kết hợp quan hệ con giáp và ngũ hành cho bức tranh đầy đủ hơn — tất cả đều là tham khảo.
        </p>
      </section>

      {/* Tra theo từng cặp con giáp — internal link tới 144 trang cặp */}
      <section className="mt-12 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Tra nhanh theo cặp con giáp
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Muốn xem thẳng hai con giáp hợp hay khắc nhau thế nào? Tra bảng đối chiếu từng cặp — kèm
          giải thích quan hệ và ngũ hành cho mỗi cặp.
        </p>
        <Link
          href="/hop-tuoi/tuoi"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-700 hover:gap-2 transition-all"
        >
          Xem bảng hợp tuổi 12 con giáp
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </section>

      {/* FAQ */}
      <section className="mt-12" aria-label="Câu hỏi thường gặp về hợp tuổi">
        <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Câu hỏi thường gặp
        </h2>
        <dl className="mt-5 space-y-5">
          {FAQS.map((f) => (
            <div key={f.q}>
              <dt className="font-medium text-foreground">{f.q}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Bắt email: nhắc nội dung theo mùa, opt-in, không spam */}
      <section
        className="mt-12 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
        aria-label="Nhận nhắc theo mùa"
      >
        <h2 className="font-heading text-lg font-semibold text-foreground">Nhận nhắc theo mùa</h2>
        <div className="mt-3 max-w-2xl">
          <OccasionLeadCapture
            source="hop-tuoi-hub"
            capturedEvent="lead_capture_hop_tuoi_hub"
            cta="Nhận nhắc"
            blurb={
              'Để lại email, chúng tôi sẽ báo bạn khi có bản hợp tuổi đầy đủ hơn và nội dung mới theo mùa: ngày tốt cưới hỏi, khai trương, hay xem ngày hợp tuổi cho từng việc. Thi thoảng thôi, không spam.'
            }
          />
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-foreground/40">
        Công cụ tham khảo — không thay thế tư vấn chuyên gia. Quyết định cuối cùng thuộc về bạn.
      </p>
    </ToolPageShell>
    <StickyMobileCta trackId="hop-tuoi" />
    </>
  );
}

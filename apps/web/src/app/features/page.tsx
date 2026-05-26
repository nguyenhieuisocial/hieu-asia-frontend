/**
 * /features — Wave 60.35 editorial redesign.
 *
 * Refined Minimalism direction: 10 raw features → 3 categorical buckets
 * ("Phân tích lá số", "Cá nhân hoá & AI", "Mở rộng"), with the flagship
 * Tử Vi Đẩu Số rendered as a 2×2 featured tile to anchor the grid.
 *
 * Vault 71 brand voice "Hiểu mình. Quyết định mình." — keep copy concrete
 * and respect-driven (we do not sell certainty, we sell clarity).
 *
 * Every card now has a destination CTA (previous version left 3/10 dead).
 * Locked-behind-paywall features carry a `Premium` badge so users see the
 * pricing implication before they click. Card titles bumped to 20px / 700
 * weight (vault 102 typography rhythm).
 *
 * Layout invariants:
 * - Mobile: single column, full-width cards.
 * - sm: 2 columns.
 * - lg: 4 columns + featured tile spanning 2×2 (top-left anchor).
 * - All interactive surfaces ≥44px tall (WCAG 2.5.5 target size — AAA).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  Calendar,
  Hash,
  Hand,
  MessageSquareHeart,
  FileText,
  Sunrise,
  Share2,
  Globe2,
  CalendarClock,
} from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
// Wave 60.35 — editorial refinement (refined-minimalism direction).
import { OrnamentDivider } from '@/components/marketing/OrnamentDivider';
// Wave 60.37.d — page-specific pillars so /features doesn't duplicate
// the conversion-safety pillars users already saw on /pricing.
import { TrustStrip, FEATURES_PILLARS } from '@/components/marketing/TrustStrip';
// Wave 60.56 P3.3 — consolidated hero (kills purple-radial paste L366).
import { MarketingHero } from '@/components/marketing/MarketingHero';

export const metadata: Metadata = {
  title: 'Tính năng',
  description:
    'Tử Vi 12 cung, Bát Tự, MBTI, Thần Số Học, Palm Reading, AI Mentor, PDF Cẩm Nang, Tử Vi hôm nay, đa ngôn ngữ. Mọi tính năng của hieu.asia.',
  alternates: { canonical: 'https://hieu.asia/features' },
  openGraph: {
    title: 'Tính năng',
    description:
      'Khám phá đầy đủ tính năng: Tử Vi 12 cung, Bát Tự, MBTI, Palm Reading, AI Mentor và nhiều hơn.',
    url: 'https://hieu.asia/features',
    type: 'website',
  },
};

/**
 * Feature badge — visual cue for the pricing implication or recency.
 * - `premium` → locked behind a paid tier (Palm, PDF, Tử Vi hôm nay, đại vận lưu niên)
 * - `new`     → recently shipped (Affiliate, AI Mentor multimodal)
 */
type Badge = 'premium' | 'new' | null;

interface Feature {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
  anchor: string;
  cta: { href: string; label: string };
  badge?: Badge;
  /** Optional 2×2 hero tile — only one feature per bucket should be `featured`. */
  featured?: boolean;
}

interface Bucket {
  id: string;
  eyebrow: string;
  title: string;
  blurb: string;
  features: readonly Feature[];
}

const BUCKETS: readonly Bucket[] = [
  {
    id: 'analysis',
    eyebrow: 'Bucket 01',
    title: 'Phân tích lá số',
    blurb:
      'Nền tảng Đông phương truyền thống kết hợp khung tâm lý hiện đại. Bốn lăng kính độc lập — bạn so sánh, không bị một nguồn duy nhất chi phối.',
    features: [
      // Wave 60.37 CRIT-3 (sub-agent B): 3/4 CTAs in this bucket all said
      // "Tìm hiểu/Khám phá X" — eye reads them as identical buttons. Rewrite
      // each to hint at the concrete action so users see destination
      // diversity (sample lá số · interpretation · calculator · upload).
      {
        Icon: Compass,
        anchor: 'tu-vi',
        title: 'Tử Vi Đẩu Số 12 cung',
        desc: 'Lá số Bắc phái với 114 sao chính và phụ. Bản đồ 12 lĩnh vực đời sống — sự nghiệp, tài chính, tình cảm, sức khoẻ — kèm đại vận và lưu niên.',
        cta: { href: '/learn/tu-vi', label: 'Xem lá số mẫu' },
        featured: true,
      },
      {
        Icon: Calendar,
        anchor: 'bat-tu',
        title: 'Bát Tự Tứ Trụ',
        desc: 'Bốn trụ Năm – Tháng – Ngày – Giờ theo Ngũ Hành. Hiểu năng lượng bẩm sinh và cách cân bằng Kim, Mộc, Thuỷ, Hoả, Thổ.',
        cta: { href: '/learn/bat-tu', label: 'Đọc giải nghĩa' },
      },
      {
        Icon: Hash,
        anchor: 'numerology-mbti',
        title: 'Thần Số Học & MBTI',
        desc: 'Số chủ đạo từ ngày sinh kết hợp 16 nhóm tính cách MBTI — khung tự nhận thức nhanh, dễ áp dụng vào công việc và quan hệ.',
        cta: { href: '/learn/than-so-hoc', label: 'Tính số chủ đạo' },
      },
      {
        Icon: Hand,
        anchor: 'palm',
        title: 'Palm Reading AI',
        desc: 'Upload ảnh lòng bàn tay — AI vision phân tích đường tâm đạo, trí đạo, sinh đạo. Dùng được khi không có giờ sinh.',
        cta: { href: '/learn/palm', label: 'Tải ảnh bàn tay' },
        badge: 'premium',
      },
    ],
  },
  {
    id: 'personalization',
    eyebrow: 'Bucket 02',
    title: 'Cá nhân hoá & AI',
    blurb:
      'Sau khi có lá số, dữ liệu sống cùng bạn. Mentor đối thoại, báo cáo xuất bản, thông điệp hàng ngày — tất cả căn cứ vào lá số của riêng bạn.',
    features: [
      {
        Icon: MessageSquareHeart,
        anchor: 'mentor',
        title: 'AI Mentor cá nhân hoá',
        desc: 'Trò chuyện với Mentor về quyết định bạn đang cân nhắc. Mentor đặt câu hỏi, gợi ý các bước — bạn vẫn là người chọn con đường.',
        cta: { href: '/onboarding?cta=mentor', label: 'Bắt đầu trò chuyện' },
        badge: 'new',
      },
      {
        Icon: FileText,
        anchor: 'pdf',
        title: 'PDF Cẩm Nang xuất bản',
        desc: 'Tải toàn bộ phân tích thành PDF được thiết kế — chia sẻ với người thân hoặc lưu giữ làm cẩm nang cá nhân.',
        cta: { href: '/pricing#premium', label: 'Mở khoá PDF' },
        badge: 'premium',
      },
      {
        Icon: Sunrise,
        anchor: 'daily',
        title: 'Tử Vi hôm nay',
        desc: 'Mỗi sáng một thông điệp ngắn dựa trên lá số của bạn. Không phải tử vi chung chung — cá nhân hoá theo cung mệnh và đại vận hiện tại.',
        cta: { href: '/tu-vi-hom-nay', label: 'Xem hôm nay' },
        badge: 'premium',
      },
    ],
  },
  {
    id: 'extensions',
    eyebrow: 'Bucket 03',
    // Wave 60.37.c HIGH-5 (sub-agent B): "Mở rộng" read as a junk drawer
    // — affiliate (community) + i18n + realtime (infra) had no shared axis.
    // Rename to a defensible 2-word grouping that legitimizes the cluster.
    title: 'Cộng đồng & hạ tầng',
    blurb:
      'Cộng đồng chia sẻ và hạ tầng vận hành — affiliate hoa hồng minh bạch, đa ngôn ngữ, đại vận lưu niên cập nhật theo thời gian thực.',
    features: [
      {
        Icon: Share2,
        anchor: 'affiliate',
        title: 'Affiliate program',
        desc: 'Chia sẻ hieu.asia với bạn bè — nhận hoa hồng minh bạch khi họ đăng ký gói. Dashboard riêng để theo dõi hiệu quả.',
        cta: { href: '/affiliate', label: 'Tham gia affiliate' },
        badge: 'new',
      },
      {
        Icon: Globe2,
        anchor: 'i18n',
        title: 'Đa ngôn ngữ',
        desc: 'Giao diện và phân tích bằng Tiếng Việt và English. Thêm ngôn ngữ khác đang được phát triển.',
        cta: { href: '/?lang=en', label: 'View in English' },
      },
      {
        Icon: CalendarClock,
        anchor: 'realtime',
        title: 'Cập nhật theo thời gian thực',
        desc: 'Đại vận và lưu niên thay đổi theo ngày tháng. Hệ thống tự động cập nhật để bạn luôn có góc nhìn mới nhất.',
        cta: { href: '/onboarding', label: 'Đăng ký theo dõi' },
      },
    ],
  },
];

const FEATURES_FAQ: readonly FaqItem[] = [
  {
    q: 'Tôi cần thông tin gì để bắt đầu?',
    a: (
      <p>
        Ngày sinh, giới tính, và nếu có — giờ sinh. Giờ sinh càng chính xác,
        phân tích Tử Vi và Bát Tự càng chi tiết. Không có giờ sinh, bạn vẫn dùng
        được MBTI, Thần Số Học và Palm Reading.
      </p>
    ),
  },
  {
    q: 'Tôi có thể cập nhật lá số sau không?',
    a: (
      <p>
        Có. Bạn có thể chỉnh sửa ngày, giờ, giới tính trong trang Tài khoản. Lá
        số mới được tính lại tức thì.
      </p>
    ),
  },
  {
    q: 'Mentor AI dùng mô hình nào?',
    a: (
      <p>
        Mentor đối thoại dùng Claude — model AI hiện đại với cửa sổ ngữ cảnh
        lớn. Mentor không phải chatbot scripted — nó hiểu lá số của bạn và đặt
        câu hỏi có ngữ cảnh.
      </p>
    ),
  },
  {
    q: 'PDF có thể xuất nhiều lần?',
    a: (
      <p>
        Có. Sau khi mở khoá báo cáo, bạn xuất PDF bao nhiêu lần tuỳ ý. Nếu cập
        nhật lá số, PDF mới sẽ phản ánh thay đổi.
      </p>
    ),
  },
  {
    q: 'Tính năng nào miễn phí, tính năng nào trả phí?',
    a: (
      <p>
        Khảo sát đầu vào và bản rút gọn Tử Vi / Bát Tự / MBTI / Thần Số Học luôn
        miễn phí. Palm Reading, PDF Cẩm Nang và Tử Vi hôm nay (badge{' '}
        <span className="font-medium text-gold">Premium</span>) yêu cầu một
        trong các gói trả phí. Xem chi tiết tại{' '}
        <Link href="/pricing" className="text-gold underline-offset-2 hover:underline">
          /pricing
        </Link>
        .
      </p>
    ),
  },
];

/**
 * Badge pill — premium = gold, new = jade. Mono-font label keeps the
 * editorial idiom consistent with the trust strip and ornament divider.
 */
function FeatureBadge({ badge }: { badge: Exclude<Badge, null> }) {
  if (badge === 'premium') {
    return (
      // /ultrareview HIGH-2: `text-gold` failed AA on cream → `text-gold-700`
      // in light, `text-gold` in dark. Wave 60.37.c HIGH-6 (sub-agent B):
      // drop `bg-gold/10` cream-on-cream blob, keep `border-gold/60` only —
      // reads more architectural and competes less with the card's own bg.
      <span className="inline-flex items-center rounded-full border border-gold/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700 dark:text-gold">
        Premium
      </span>
    );
  }
  return (
    // Wave 60.37.c HIGH-6: same border-only treatment for symmetry.
    <span className="inline-flex items-center rounded-full border border-jade/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-jade">
      Mới
    </span>
  );
}

/**
 * Single feature card.
 *
 * `featured` triggers the 2×2 hero treatment on `lg+`: gold ring, larger
 * icon, two-column copy. On mobile it falls back to standard card so we
 * don't lose vertical density.
 */
function FeatureCard({ feature }: { feature: Feature }) {
  const { Icon, anchor, title, desc, cta, badge, featured } = feature;
  return (
    <article
      id={anchor}
      className={[
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-card/40 p-6 transition-all duration-300',
        'hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_40px_-12px_rgba(184,146,61,0.4)]',
        // Featured tile spans 2×2 on lg+. Border bumped to gold to mark it
        // as the cluster anchor.
        // Wave 60.37 HIGH-4 (sub-agent B): the gold/purple gradient at
        // /[0.06] + /[0.04] was visually invisible in light mode (gold-on-
        // cream at 6% alpha = no diff). Bump light to /15 + /6 so the
        // "this is the flagship" signal survives both themes.
        featured
          ? 'border-gold/50 bg-gradient-to-br from-gold/15 via-card/40 to-purple/[0.06] dark:from-gold/[0.06] dark:to-purple/[0.04] lg:col-span-2 lg:row-span-2 lg:p-8'
          : 'border-border',
      ].join(' ')}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={[
            'inline-flex shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/5 transition-colors',
            'group-hover:border-gold/60 group-hover:bg-gold/10',
            featured ? 'h-14 w-14 lg:h-16 lg:w-16' : 'h-11 w-11',
          ].join(' ')}
        >
          <Icon
            className={featured ? 'h-7 w-7 text-gold lg:h-8 lg:w-8' : 'h-5 w-5 text-gold'}
            aria-hidden={true}
          />
        </div>
        {badge && <FeatureBadge badge={badge} />}
      </div>

      {/* Wave 60.37 HIGH-7 (sub-agent B): card titles nested inside an h2-headed
          bucket should be h3 not h2 — WCAG 1.3.1 heading hierarchy. Visual
          weight unchanged (Tailwind classes drive style, not the tag). */}
      <h3
        className={[
          'font-heading font-bold leading-tight text-foreground',
          // Vault 102 typography — body cards 20px/700, featured 28px on lg.
          featured ? 'text-xl lg:text-2xl' : 'text-xl',
        ].join(' ')}
      >
        {title}
      </h3>
      <p
        className={[
          'mt-2 flex-1 leading-relaxed text-muted-foreground',
          featured ? 'text-base lg:max-w-prose' : 'text-sm',
        ].join(' ')}
      >
        {desc}
      </p>

      {/* WCAG 2.5.5 target size — min-h-11 = 44px tap target. asChild keeps
          the underlying <Link> for client-side routing and prefetch. */}
      <Button
        asChild
        variant={featured ? 'default' : 'outline'}
        size="sm"
        className="mt-5 min-h-11 w-full"
      >
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </article>
  );
}

/**
 * Wave 60.56 P3.3 — italic verb span on bucket H2 lead noun.
 * Pattern matches MarketingHero (`<em class="italic text-gold-soft">`).
 * Keeps bucket.title string-typed in the BUCKETS array (no JSX in data).
 */
function renderBucketTitle(id: string, title: string) {
  // analysis: "Phân tích lá số"   → italicise "Phân tích"
  // personalization: "Cá nhân hoá & AI" → italicise "Cá nhân hoá"
  // extensions: "Cộng đồng & hạ tầng" → italicise "Cộng đồng"
  const splitAt: Record<string, number> = {
    analysis: 'Phân tích'.length,
    personalization: 'Cá nhân hoá'.length,
    extensions: 'Cộng đồng'.length,
  };
  const cut = splitAt[id];
  if (!cut) return title;
  return (
    <>
      <em className="italic text-gold-soft">{title.slice(0, cut)}</em>
      {title.slice(cut)}
    </>
  );
}

// Wave 60.60.b — SEO + GEO structured data.
// ItemList of the four lenses (Tử Vi, Bát Tự, Thần Số, MBTI) for Google
// Rich Results + AI assistants (ChatGPT/Claude/Perplexity/Gemini) so they
// can cite each lens by name with a stable URL.
const FEATURES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Tính năng hieu.asia — bốn lăng kính tự nhận thức',
  description:
    'Tử Vi 12 cung, Bát Tự Tứ Trụ, Thần Số Học, MBTI và Palm Reading — bốn lăng kính độc lập giúp bạn nhìn chính mình từ nhiều góc.',
  inLanguage: 'vi-VN',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: 4,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'Tử Vi Đẩu Số',
        url: 'https://hieu.asia/learn/tu-vi',
        description:
          'Lá số Tử Vi 12 cung với 114 sao (chính tinh + phụ tinh) theo trường phái Bắc phái — bản đồ 12 lĩnh vực đời sống.',
        provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
        areaServed: 'VN',
        inLanguage: 'vi-VN',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        name: 'Bát Tự Tứ Trụ',
        url: 'https://hieu.asia/learn/bat-tu',
        description:
          'Bát Tự 4 trụ Năm-Tháng-Ngày-Giờ theo Ngũ Hành (Kim Mộc Thủy Hỏa Thổ) — cân bằng năng lượng bẩm sinh + dụng thần.',
        provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
        areaServed: 'VN',
        inLanguage: 'vi-VN',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        name: 'Thần Số Học',
        url: 'https://hieu.asia/learn/than-so-hoc',
        description:
          'Thần Số Học theo Pythagoras — số chủ đạo (Life Path) 1-9 + 11, 22, 33, phân tích chu kỳ 9 năm.',
        provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
        areaServed: 'VN',
        inLanguage: 'vi-VN',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Service',
        name: 'MBTI 16 loại tính cách',
        url: 'https://hieu.asia/learn/mbti',
        description:
          'MBTI dựa trên 4 trục của Carl Jung (E/I, S/N, T/F, J/P) — khung tự nhận thức về cách bạn vận hành tự nhiên.',
        provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
        areaServed: 'VN',
        inLanguage: 'vi-VN',
      },
    },
  ],
};

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FEATURES_JSON_LD) }}
      />
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* Hero — Wave 60.56 P3.3: consolidated MarketingHero (R1 finding:
            kill purple-radial paste, single source of truth for hero block). */}
        <MarketingHero
          eyebrow="SẢN PHẨM · 10 TÍNH NĂNG · 3 CHƯƠNG"
          title={
            <>
              Bốn ống kính, <em className="italic text-gold-soft">mười</em> ngôn
              ngữ tự hiểu<span className="text-gold-dot">.</span>
            </>
          }
          subtitle="Từ phân tích sao trên cung mệnh đến nhật ký nội tâm có A.I phản chiếu — tất cả nhằm giúp bạn nhận diện chính mình rõ hơn từng ngày."
          primaryCta={{ label: 'Bắt đầu luận giải', href: '/onboarding' }}
          secondaryCta={{ label: 'Xem bảng giá', href: '/pricing' }}
        />
        <section className="bg-background">
          <div className="mx-auto max-w-4xl px-6 pt-12">
            <TrustStrip pillars={FEATURES_PILLARS} />
          </div>
          <OrnamentDivider className="mt-12 mb-12" />
        </section>

        {/* Categorised feature buckets */}
        {BUCKETS.map((bucket, bucketIdx) => {
          // Wave 60.37 CRIT-1 (sub-agent B): bucket-02/03 had `sm:grid-cols-2`
          // which orphaned card #3 alone on row 2 of the tablet viewport
          // (768px). Promote to `md:grid-cols-3` for 3-card buckets so the
          // orphan never exists between sm and lg. Featured-bucket keeps
          // lg:grid-cols-4 (the 2×2 anchor + 3 normals math).
          const hasFeatured = bucket.features.some((f) => f.featured);
          const n = bucket.features.length;
          const lgCols =
            hasFeatured && n >= 4
              ? 'lg:grid-cols-4'
              : n >= 4
                ? 'md:grid-cols-3 lg:grid-cols-4'
                : n === 3
                  ? 'md:grid-cols-3'
                  : '';
          return (
            <section
              key={bucket.id}
              id={bucket.id}
              className="relative bg-background py-12 sm:py-16"
            >
              <div className="mx-auto max-w-6xl px-6">
                {/* Bucket header — editorial chapter marker.
                    Wave 60.56 P3.3: italic verb spans on lead noun match the
                    MarketingHero idiom (Instrument-serif italic in gold-soft). */}
                <header className="mx-auto max-w-2xl text-center">
                  <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
                    {bucket.eyebrow}
                  </p>
                  <h2 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                    {renderBucketTitle(bucket.id, bucket.title)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {bucket.blurb}
                  </p>
                </header>

                {/* Feature grid — columns adapt to bucket shape (see comment above) */}
                <div
                  className={[
                    'mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2',
                    lgCols,
                  ]
                    .join(' ')
                    .trim()}
                >
                  {bucket.features.map((feature) => (
                    <FeatureCard key={feature.anchor} feature={feature} />
                  ))}
                </div>
              </div>

              {/* Wave 60.37 CRIT-2 (sub-agent B): glyph hierarchy was inverted —
                  heavier ❖ was used BETWEEN buckets (transitional) while the
                  lighter default ◆ landed before the CTA strip (the climax).
                  Swap: ◆ for transitions, ❖ for the climax (matches
                  OrnamentDivider's own JSDoc "❖ for sections with more weight"). */}
              {bucketIdx < BUCKETS.length - 1 && (
                <OrnamentDivider className="mt-16" />
              )}
            </section>
          );
        })}

        {/* CTA strip */}
        {/* Wave 60.37.c SUGGEST-13 (sub-agent B): add subtle gold radial
            behind the CTA so the section reads as a "moment", not just
            another row. Vercel/Linear pattern — single accent gradient
            to mark the climax of the page. */}
        <section className="relative isolate overflow-hidden bg-background py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(184,146,61,0.07),transparent_70%)]"
          />
          <OrnamentDivider className="mb-12" glyph="❖" />
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80 sm:text-xs">
              Bắt đầu
            </p>
            <h2 className="mt-4 text-balance font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Khảo sát đầu vào{' '}
              <span className="bg-gold-gradient bg-clip-text text-transparent">3 phút</span>
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Miễn phí, không cần thẻ. Hoàn tiền 24 giờ nếu báo cáo chưa được tạo.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="min-h-12 min-w-[220px]">
                <Link href="/onboarding">Mở khoá lá số</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-12 min-w-[220px]">
                <Link href="/pricing">Xem bảng giá</Link>
              </Button>
            </div>
          </div>
        </section>

        <FaqAccordion
          items={FEATURES_FAQ}
          id="features-faq"
          eyebrow="FAQ tính năng"
          title="Câu hỏi về tính năng"
        />
      </main>
      <SiteFooter />
    </>
  );
}

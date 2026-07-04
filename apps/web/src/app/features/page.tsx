/**
 * /features — editorial content refresh (was Wave 60.35, 3 buckets / 10 tính
 * năng — undercounted the live product). Now 4 categorical chapters that map
 * to how the product is actually shaped:
 *   01 "Năm lăng kính cốt lõi"        — the 5 flagship lenses (Tử Vi anchor).
 *   02 "Lăng kính tâm lý & phương Tây" — DISC, Enneagram, Tarot, chiêm tinh, Dịch.
 *   03 "Bộ ra quyết định"             — Mentor + simulator + nhật ký + tra cứu.
 *   04 "Cộng đồng & hạ tầng"          — affiliate, quà, đa ngôn ngữ, realtime.
 *
 * Vault 71 brand voice "Hiểu mình. Quyết định mình." — keep copy concrete
 * and respect-driven (we do not sell certainty, we sell clarity).
 *
 * Every card has a destination CTA. Free/paid state is admin-configurable and
 * changes, so we do NOT stamp per-tool `Premium` badges; instead we describe
 * value and point gated unlocks at /pricing. `Mới` badge marks recent ships.
 * Card titles 20px / 700 weight (vault 102 typography rhythm).
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
  Brain,
  BarChart3,
  Hand,
  MessageSquareHeart,
  FileText,
  Sunrise,
  Share2,
  Globe2,
  CalendarClock,
  Layers,
  Hexagon,
  Sparkles,
  Orbit,
  Moon,
  CircleDot,
  Target,
  TrendingUp,
  GitCompare,
  CalendarCheck,
  Gift,
  Users,
} from 'lucide-react';
import { Button } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
// Wave 60.35 — editorial refinement (refined-minimalism direction).
import { OrnamentDivider } from '@/components/marketing/OrnamentDivider';
// Wave 60.37.d — page-specific pillars so /features doesn't duplicate
// the conversion-safety pillars users already saw on /pricing.
import { TrustStrip, FEATURES_PILLARS } from '@/components/marketing/TrustStrip';
// Wave 60.56 P3.3 — consolidated hero (kills purple-radial paste L366).
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Tính năng',
  description:
    'Tử Vi, Bát Tự, MBTI, Big Five, Xem Tướng, DISC, Enneagram, Tarot, chiêm tinh, Kinh Dịch và bộ ra quyết định với AI Mentor — hơn 50 công cụ.',
  alternates: { canonical: 'https://hieu.asia/features' },
  openGraph: {
    title: 'Tính năng',
    description:
      'Năm lăng kính cốt lõi + DISC, Enneagram, Tarot, chiêm tinh phương Tây, Kinh Dịch và bộ ra quyết định với AI Mentor. Hơn 50 công cụ giúp bạn hiểu mình và quyết định.',
    url: 'https://hieu.asia/features',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

/**
 * Feature badge — visual cue for recency or maturity.
 * - `new`  → recently shipped (DISC, Enneagram, decision suite, affiliate…)
 * - `beta` → live but a secondary/cross-check layer (Bát Tự)
 *
 * NOTE: we no longer use a `premium` badge. Free/paid is admin-configurable
 * and shifts over time, so absolute per-tool "Premium" claims go stale fast;
 * gated unlocks are surfaced in copy via a /pricing link instead.
 */
type Badge = 'new' | 'beta' | null;

interface Feature {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
  anchor: string;
  cta?: { href: string; label: string };
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
    id: 'core-lenses',
    eyebrow: 'Chương 01',
    title: 'Năm lăng kính cốt lõi',
    blurb:
      'Nền tảng Đông phương truyền thống kết hợp khung tâm lý hiện đại. Năm lăng kính độc lập để bạn so sánh, không bị một nguồn duy nhất chi phối.',
    features: [
      {
        Icon: Compass,
        anchor: 'tu-vi',
        title: 'Tử Vi Đẩu Số 12 cung',
        desc: 'Lá số Bắc phái với 121 sao chính và phụ. Bản đồ 12 lĩnh vực đời sống — sự nghiệp, tài chính, tình cảm, sức khoẻ — kèm đại vận và lưu niên. Bản luận giải đầy đủ được mở khoá qua /pricing.',
        cta: { href: '/learn/tu-vi', label: 'Xem lá số mẫu' },
        featured: true,
      },
      {
        Icon: Calendar,
        anchor: 'bat-tu',
        title: 'Bát Tự Tứ Trụ',
        desc: 'Bốn trụ Năm – Tháng – Ngày – Giờ quanh Nhật Chủ (chính bạn). Lớp đối chiếu phụ với Tử Vi, qua tương quan ngũ hành Kim – Mộc – Thủy – Hỏa – Thổ.',
        cta: { href: '/learn/bat-tu', label: 'Đọc giải nghĩa' },
        badge: 'beta',
      },
      {
        Icon: Brain,
        anchor: 'mbti',
        title: 'MBTI 16 nhóm tính cách',
        desc: '16 kiểu tâm trí trên 4 trục của Carl Jung (E/I · S/N · T/F · J/P) — khung tự nhận thức nhanh, dễ áp dụng vào công việc và quan hệ.',
        cta: { href: '/mbti', label: 'Làm trắc nghiệm' },
      },
      {
        Icon: BarChart3,
        anchor: 'big-five',
        title: 'Big Five (OCEAN)',
        desc: 'Mô hình 5 chiều tính cách có cơ sở khoa học vững nhất — Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Bất ổn cảm xúc — kèm bản đọc sâu cá nhân hoá.',
        cta: { href: '/big-five', label: 'Làm trắc nghiệm' },
      },
      {
        Icon: Hand,
        anchor: 'palm',
        title: 'Xem Tướng — Chỉ tay & Tướng mặt',
        desc: 'Tải ảnh lòng bàn tay hoặc khuôn mặt — AI vision đọc nét tướng, mô tả xu hướng tính cách (không phán số mệnh). Dùng được khi không có giờ sinh.',
        cta: { href: '/xem-tuong', label: 'Tải ảnh' },
      },
    ],
  },
  {
    id: 'deep-lenses',
    eyebrow: 'Chương 02',
    title: 'Lăng kính tâm lý & phương Tây',
    blurb:
      'Thêm những góc nhìn sâu để bạn đối chiếu: tâm lý học hiện đại, chiêm tinh phương Tây, trực giác và Kinh Dịch — mỗi cái một cách kể về cùng một con người.',
    features: [
      {
        Icon: Layers,
        anchor: 'disc',
        title: 'DISC — phong cách hành vi',
        desc: 'Bốn xu hướng hành vi D · I · S · C — bạn ra quyết định, giao tiếp và làm việc nhóm theo cách nào. Thực dụng cho môi trường công việc.',
        cta: { href: '/disc', label: 'Làm trắc nghiệm' },
        badge: 'new',
      },
      {
        Icon: Hexagon,
        anchor: 'enneagram',
        title: 'Enneagram — 9 kiểu động lực',
        desc: '9 kiểu tính cách xoay quanh động lực và nỗi sợ cốt lõi — soi vào "vì sao" đằng sau hành vi, bổ sung cho MBTI và Big Five.',
        cta: { href: '/enneagram', label: 'Khám phá kiểu của bạn' },
        badge: 'new',
      },
      {
        Icon: Sparkles,
        anchor: 'tarot',
        title: 'Tarot — trải bài phản chiếu',
        desc: 'Rút 1 lá hoặc 3 lá để soi một câu hỏi đang trăn trở. Là công cụ phản chiếu nội tâm, không phải lời tiên tri chắc chắn.',
        cta: { href: '/tarot', label: 'Rút bài' },
      },
      {
        Icon: Orbit,
        anchor: 'ban-do-sao',
        title: 'Bản đồ sao (natal chart)',
        desc: 'Bản đồ chiêm tinh phương Tây lúc bạn chào đời. Cung Mọc (Ascendant) cần giờ và nơi sinh chính xác — thiếu dữ liệu thì phần đó được lược bớt.',
        cta: { href: '/ban-do-sao', label: 'Lập bản đồ sao' },
      },
      {
        Icon: Moon,
        anchor: 'cung-hoang-dao',
        title: 'Cung hoàng đạo',
        desc: '12 cung hoàng đạo theo ngày sinh — lối vào nhẹ nhàng vào chiêm tinh phương Tây trước khi đi sâu vào bản đồ sao đầy đủ.',
        cta: { href: '/cung-hoang-dao', label: 'Xem cung của bạn' },
      },
      {
        Icon: CircleDot,
        anchor: 'gieo-que',
        title: 'Kinh Dịch — Gieo quẻ',
        desc: 'Gieo một quẻ Dịch cho tình huống bạn đang phân vân. 64 quẻ làm khung gợi mở để suy ngẫm, không phải phán định cứng nhắc.',
        cta: { href: '/gieo-que', label: 'Gieo quẻ' },
      },
    ],
  },
  {
    id: 'decisions',
    eyebrow: 'Chương 03',
    title: 'Bộ ra quyết định',
    blurb:
      'Hiểu mình mới là một nửa. Phần này biến hiểu biết thành hành động: Mentor đối thoại, mô phỏng lựa chọn, nhật ký, và cả kho tra cứu theo dịp cho việc lớn.',
    features: [
      {
        Icon: MessageSquareHeart,
        anchor: 'mentor',
        title: 'AI Mentor cá nhân hoá',
        desc: 'Trò chuyện với Mentor về quyết định bạn đang cân nhắc. Mentor hiểu lá số của bạn, đặt câu hỏi có ngữ cảnh và gợi ý các bước — bạn vẫn là người chọn con đường.',
        cta: { href: '/decisions', label: 'Bắt đầu trò chuyện' },
        featured: true,
        badge: 'new',
      },
      {
        Icon: Target,
        anchor: 'decision-simulator',
        title: 'Decision Simulator',
        desc: 'Đặt hai, ba phương án cạnh nhau và xem mỗi lựa chọn dẫn tới đâu — dựa trên lá số và bối cảnh của bạn, để cân nhắc trước khi quyết.',
        cta: { href: '/decision-simulator', label: 'Mô phỏng lựa chọn' },
        badge: 'new',
      },
      {
        Icon: FileText,
        anchor: 'journal',
        title: 'Nhật ký & Weekly Review',
        desc: 'Ghi lại quyết định và cảm nhận trong Nhật ký, rồi nhìn lại mỗi tuần với Weekly Review — thấy mình đang đi theo hướng nào.',
        cta: { href: '/journal', label: 'Mở nhật ký' },
        badge: 'new',
      },
      {
        Icon: Users,
        anchor: 'compatibility',
        title: 'Hợp đôi & Hướng nghề',
        desc: 'Compatibility soi sự hợp – khác giữa hai người; Career-fit gợi ý hướng nghề hợp với thiên hướng của bạn. Đối chiếu, không phán quyết.',
        cta: { href: '/compatibility', label: 'Xem mức độ hợp' },
      },
      {
        Icon: TrendingUp,
        anchor: 'planning',
        title: 'Kế hoạch & Timeline đại vận',
        desc: 'Bản đồ cá nhân, kế hoạch năm và tháng, cùng Timeline đại vận — xâu chuỗi các giai đoạn lớn để bạn nhìn đường dài thay vì từng ngày rời rạc.',
        cta: { href: '/timeline', label: 'Xem timeline đại vận' },
      },
      {
        Icon: GitCompare,
        anchor: 'explore',
        title: 'So sánh, Hỏi đáp & Xem hợp nhóm',
        desc: 'So sánh lăng kính để thấy các góc nhìn nói gì về cùng một điểm, đặt câu hỏi tự do ở Hỏi đáp, hay xem mức hợp của cả nhóm / gia đình.',
        cta: { href: '/so-sanh', label: 'So sánh lăng kính' },
      },
      {
        Icon: Sunrise,
        anchor: 'daily',
        title: 'Tử Vi hôm nay & PDF Cẩm Nang',
        desc: 'Mỗi sáng một thông điệp ngắn theo cung mệnh và đại vận hiện tại. Toàn bộ phân tích cũng xuất được thành PDF Cẩm Nang khi bạn mở khoá báo cáo.',
        cta: { href: '/tu-vi-hom-nay', label: 'Xem hôm nay' },
      },
      {
        Icon: CalendarCheck,
        anchor: 'occasion-tools',
        title: 'Tra cứu theo dịp & việc lớn',
        desc: 'Lịch vạn niên, xem ngày tốt, giờ hoàng đạo, sao hạn, ngày kiêng kỵ, đặt tên ngũ hành, hợp tuổi, xem tuổi cưới – làm nhà – khai trương, hướng nhà — một kho tra cứu cho từng dịp.',
        cta: { href: '/cong-cu', label: 'Mở kho công cụ' },
      },
    ],
  },
  {
    id: 'community',
    eyebrow: 'Chương 04',
    title: 'Cộng đồng & hạ tầng',
    blurb:
      'Phần giữ trải nghiệm sống động và minh bạch — chia sẻ nhận quà, affiliate hoa hồng rõ ràng, đa ngôn ngữ, và đại vận cập nhật theo thời gian thực.',
    features: [
      {
        Icon: Gift,
        anchor: 'rewards',
        title: 'Điểm danh nhận quà & mời bạn',
        desc: 'Điểm danh mỗi ngày để nhận quà, và mời bạn bè cùng dùng để cả hai nhận voucher. Một cách nhẹ nhàng để giữ thói quen tự soi mình.',
        cta: { href: '/qua', label: 'Nhận quà hôm nay' },
        badge: 'new',
      },
      {
        Icon: Share2,
        anchor: 'affiliate',
        title: 'Affiliate program',
        desc: 'Chia sẻ hieu.asia và nhận hoa hồng minh bạch: 30% trên đơn đầu tiên và 10% trên các lần gia hạn. Một tầng duy nhất, không đa cấp.',
        cta: { href: '/affiliate', label: 'Tham gia affiliate' },
      },
      {
        Icon: Globe2,
        anchor: 'i18n',
        title: 'Đa ngôn ngữ',
        desc: 'Hiện hỗ trợ Tiếng Việt. Đa ngôn ngữ đang được phát triển.',
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
        được MBTI, Big Five, Thần Số Học và Xem Tướng.
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
        Mentor đối thoại chạy trên các mô hình AI hàng đầu với cửa sổ ngữ cảnh
        lớn. Quan trọng hơn tên mô hình là cách nó hành xử: Mentor hiểu lá số của
        bạn, đặt câu hỏi có ngữ cảnh và gợi ý các bước — không phải chatbot trả
        lời theo kịch bản, và bạn vẫn là người quyết định. Xem chi tiết engine
        tính gì và AI luận gì tại{' '}
        <Link href="/methodology" className="text-gold-700 underline-offset-2 hover:underline">
          Phương pháp luận
        </Link>
        .
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
        Bạn dùng thử được phần lớn công cụ mà không mất phí; phần được mở khoá là
        các bản luận giải sâu — đầy đủ nhất là bản luận giải Tử Vi. Ranh giới
        miễn phí / trả phí có thể thay đổi theo thời gian, nên thay vì nêu cứng
        từng tính năng, bạn xem trạng thái mới nhất và những gì mỗi gói mở khoá
        tại{' '}
        <Link href="/pricing" className="text-gold-700 underline-offset-2 hover:underline">
          /pricing
        </Link>
        .
      </p>
    ),
  },
];

/**
 * Badge pill — beta = gold, new = jade. Mono-font label keeps the
 * editorial idiom consistent with the trust strip and ornament divider.
 */
function FeatureBadge({ badge }: { badge: Exclude<Badge, null> }) {
  if (badge === 'beta') {
    return (
      // /ultrareview HIGH-2: `text-gold` failed AA on cream → `text-gold-700`
      // in light, `text-gold` in dark. Wave 60.37.c HIGH-6 (sub-agent B):
      // drop `bg-gold/10` cream-on-cream blob, keep `border-gold/60` only —
      // reads more architectural and competes less with the card's own bg.
      <span className="inline-flex items-center rounded-full border border-gold/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gold-700 dark:text-gold">
        Beta
      </span>
    );
  }
  return (
    // Wave 60.37.c HIGH-6: same border-only treatment for symmetry.
    <span className="inline-flex items-center rounded-full border border-jade/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-jade-300">
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
      {cta && (
        <Button
          asChild
          variant={featured ? 'default' : 'outline'}
          size="sm"
          className="mt-5 min-h-11 w-full"
        >
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      )}
    </article>
  );
}

/**
 * Wave 60.56 P3.3 — italic verb span on bucket H2 lead noun.
 * Pattern matches MarketingHero (`<em class="italic text-gold-soft">`).
 * Keeps bucket.title string-typed in the BUCKETS array (no JSX in data).
 */
function renderBucketTitle(id: string, title: string) {
  // core-lenses:  "Năm lăng kính cốt lõi"        → italicise "Năm lăng kính"
  // deep-lenses:  "Lăng kính tâm lý & phương Tây" → italicise "Lăng kính"
  // decisions:    "Bộ ra quyết định"             → italicise "Bộ ra"
  // community:    "Cộng đồng & hạ tầng"          → italicise "Cộng đồng"
  const splitAt: Record<string, number> = {
    'core-lenses': 'Năm lăng kính'.length,
    'deep-lenses': 'Lăng kính'.length,
    decisions: 'Bộ ra'.length,
    community: 'Cộng đồng'.length,
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
// ItemList of the five flagship lenses (Tử Vi, Bát Tự, MBTI, Big Five, Xem
// Tướng) for Google Rich Results + AI assistants (ChatGPT/Claude/Perplexity/
// Gemini) so they can cite each lens by name with a stable URL.
const FEATURES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Tính năng hieu.asia — năm lăng kính tự nhận thức',
  description:
    'Tử Vi 12 cung, Bát Tự Tứ Trụ, MBTI, Big Five (OCEAN) và Xem Tướng — năm lăng kính độc lập giúp bạn nhìn chính mình từ nhiều góc.',
  inLanguage: 'vi-VN',
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  numberOfItems: 5,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'Tử Vi Đẩu Số',
        url: 'https://hieu.asia/learn/tu-vi',
        description:
          'Lá số Tử Vi 12 cung với 121 sao (chính tinh + phụ tinh) theo trường phái Bắc phái — bản đồ 12 lĩnh vực đời sống.',
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
          'Bát Tự 4 trụ Năm-Tháng-Ngày-Giờ quanh Nhật Chủ (chính bạn) — thiên hướng bẩm sinh + thời điểm thuận để quyết định, qua tương quan ngũ hành (Kim Mộc Thủy Hỏa Thổ).',
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
        name: 'MBTI 16 loại tính cách',
        url: 'https://hieu.asia/learn/mbti',
        description:
          'MBTI dựa trên 4 trục của Carl Jung (E/I, S/N, T/F, J/P) — khung tự nhận thức về cách bạn vận hành tự nhiên.',
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
        name: 'Big Five (OCEAN)',
        url: 'https://hieu.asia/learn/big-five',
        description:
          'Big Five (OCEAN) — 5 chiều tính cách (Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Bất ổn cảm xúc) có cơ sở khoa học vững nhất, kèm bản đọc sâu cá nhân hoá.',
        provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
        areaServed: 'VN',
        inLanguage: 'vi-VN',
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Service',
        name: 'Xem Tướng (Chỉ tay & Tướng mặt)',
        url: 'https://hieu.asia/learn/palm',
        description:
          'Đọc chỉ tay và tướng mặt bằng AI vision — nhận diện nét tướng, mô tả xu hướng tính cách (không phán số mệnh).',
        provider: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
        areaServed: 'VN',
        inLanguage: 'vi-VN',
      },
    },
  ],
};

// FAQPage JSON-LD — plain-string mirror of the FEATURES_FAQ accordion shown on
// the page (chữ schema === chữ hiển thị, chống cloaking). Answers are the JSX
// FEATURES_FAQ rendered as clean strings; the /pricing <Link> becomes its
// visible text "/pricing".
const FEATURES_FAQ_SCHEMA = [
  {
    q: 'Tôi cần thông tin gì để bắt đầu?',
    a: 'Ngày sinh, giới tính, và nếu có — giờ sinh. Giờ sinh càng chính xác, phân tích Tử Vi và Bát Tự càng chi tiết. Không có giờ sinh, bạn vẫn dùng được MBTI, Big Five, Thần Số Học và Xem Tướng.',
  },
  {
    q: 'Tôi có thể cập nhật lá số sau không?',
    a: 'Có. Bạn có thể chỉnh sửa ngày, giờ, giới tính trong trang Tài khoản. Lá số mới được tính lại tức thì.',
  },
  {
    q: 'Mentor AI dùng mô hình nào?',
    a: 'Mentor đối thoại chạy trên các mô hình AI hàng đầu với cửa sổ ngữ cảnh lớn. Quan trọng hơn tên mô hình là cách nó hành xử: Mentor hiểu lá số của bạn, đặt câu hỏi có ngữ cảnh và gợi ý các bước — không phải chatbot trả lời theo kịch bản, và bạn vẫn là người quyết định. Xem chi tiết engine tính gì và AI luận gì tại Phương pháp luận (/methodology).',
  },
  {
    q: 'PDF có thể xuất nhiều lần?',
    a: 'Có. Sau khi mở khoá báo cáo, bạn xuất PDF bao nhiêu lần tuỳ ý. Nếu cập nhật lá số, PDF mới sẽ phản ánh thay đổi.',
  },
  {
    q: 'Tính năng nào miễn phí, tính năng nào trả phí?',
    a: 'Bạn dùng thử được phần lớn công cụ mà không mất phí; phần được mở khoá là các bản luận giải sâu — đầy đủ nhất là bản luận giải Tử Vi. Ranh giới miễn phí / trả phí có thể thay đổi theo thời gian, nên thay vì nêu cứng từng tính năng, bạn xem trạng thái mới nhất và những gì mỗi gói mở khoá tại /pricing.',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={[FEATURES_JSON_LD, faqPage(FEATURES_FAQ_SCHEMA)]} />
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground">
        {/* Hero — Wave 60.56 P3.3: consolidated MarketingHero (R1 finding:
            kill purple-radial paste, single source of truth for hero block).
            Wave 60.79.T1 (vault 112 P0-04): add gold-ring ornament so the
            right half of the hero is no longer empty on lg+. */}
        <MarketingHero
          eyebrow="SẢN PHẨM · 50+ CÔNG CỤ · 4 CHƯƠNG"
          title={
            <>
              Năm ống kính, <em className="italic text-gold-soft">nhiều</em> ngôn
              ngữ tự hiểu<span className="text-gold-dot">.</span>
            </>
          }
          subtitle="Năm lăng kính cốt lõi, thêm tâm lý hiện đại, chiêm tinh phương Tây và cả bộ ra quyết định — từ phân tích sao trên cung mệnh đến nhật ký nội tâm có A.I phản chiếu, giúp bạn nhận diện chính mình rõ hơn từng ngày."
          primaryCta={{ label: 'Bắt đầu luận giải', href: '/onboarding' }}
          secondaryCta={{ label: 'Xem bảng giá', href: '/pricing' }}
          ornament="gold-ring"
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
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700 sm:text-xs">
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
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700 sm:text-xs">
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
      <StickyMobileCta trackId="features" />
    </>
  );
}

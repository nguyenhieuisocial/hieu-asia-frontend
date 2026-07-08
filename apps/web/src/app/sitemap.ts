import type { MetadataRoute } from 'next';
import { expiredSeasonalTarget } from '@/lib/seasonal';
import { PALACES_CONTENT, ALL_STARS_CONTENT } from '@/lib/tuvi-content';
import { listCaseStudies } from '@/lib/case-studies';
import { PALACE_READINGS } from '@/lib/palace-readings';
import { PURPOSES } from './xem-ngay/purposes';
import { VARIANTS } from './dat-ten-ngu-hanh/variants';
import { BIRTH_YEARS, slugOf } from './xem-tuoi-cuoi/years';
import { VARIANTS as SINH_CON_VARIANTS } from './sinh-con/variants';
import { BIRTH_YEARS as LAM_NHA_BIRTH_YEARS, slugOf as lamNhaSlugOf } from './xem-tuoi-lam-nha/years';
import { HOST_YEARS as XONG_DAT_YEARS, slugOf as xongDatSlug } from './xong-dat/years';
import { BIRTH_YEARS as KHAI_TRUONG_YEARS, slugOf as khaiTruongSlug } from './khai-truong/years';
import { BIRTH_YEARS as HUONG_NHA_YEARS, slugOf as huongNhaSlug } from './huong-nha/years';
import { ZODIAC, canonicalPairSlug } from '@/lib/hop-tuoi-pairs';
import { COMPARISONS } from '@/lib/so-sanh';
import { ALL_PAGES as TAROT_PAGES } from '@/lib/tarot-card-pages';
import { QUE_PAGES } from '@/lib/que-kinh-dich';
import { SO_CHU_DAO } from '@/lib/than-so-hoc-numbers';
import { LOAI_SO } from '@/lib/than-so-hoc-loai-so';
import { SAO_GIO } from '@/lib/gio-hoang-dao-stars';
import { CUNG_SLUGS } from '@/lib/cung-hoang-dao-data';
import { BIRTH_YEARS as BAN_MENH_YEARS } from '@/lib/ban-menh-data';
import { TAM_TAI_SLUGS } from '@/lib/tam-tai-data';
import { ALL_PAIRS as CUNG_HOP_PAIRS } from '@/lib/cung-hoang-dao-hop-data';
import { ENNEAGRAM_SLUGS } from '@/lib/enneagram-type-data';
import { MBTI_SLUGS } from '@/lib/mbti-type-data';
import { DISC_SLUGS } from '@/lib/disc-type-data';
import { BIG_FIVE_SLUGS } from '@/lib/big-five-trait-data';
import { CON_GIAP_SLUGS } from '@/lib/con-giap-data';

const BASE_URL = 'https://hieu.asia';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

// Sinh TĨNH tại BUILD (không regen theo-request) → Googlebot luôn nhận sitemap
// tức thì, khỏi rủi ro cold-start/API-chậm làm GSC timeout "không thể tìm nạp".
// URL 99% từ import tĩnh; chỉ pillars cam-nang là fetch (đã bọc try/catch,
// non-fatal). `revalidate` = ISR 1h nền → bài cam-nang mới hiện trong ~1h (hoặc
// ngay khi deploy — mọi cập nhật nội dung đều kích deploy → rebuild sitemap).
export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Mốc lastmod CỐ ĐỊNH cho trang tĩnh. KHÔNG dùng `new Date()`: sitemap là route động,
  // giờ-sinh-theo-request làm MỌI URL "đổi lastmod" mỗi lần regen → Google ngừng tin tín
  // hiệu lastmod + quét lại sitemap liên tục (dễ trúng cửa sổ deploy → "không đọc được").
  // Mốc ổn định giúp crawl hiệu quả hơn. BUMP mốc này khi có cập nhật nội dung lớn.
  // (Trang động — community cases / cẩm nang pillars — vẫn dùng ngày publish THẬT bên dưới.)
  // 2026-07-02: bump sau đợt nâng cấp /learn lớn (18 chủ đề, hub 12 con giáp + sao hạn,
  // active-learning) → báo Google nội dung mới, kích crawl lại.
  const SITE_CONTENT_DATE = new Date('2026-07-02T00:00:00Z');
  const now = SITE_CONTENT_DATE;

  const palaceUrls: MetadataRoute.Sitemap = PALACES_CONTENT.map((p) => ({
    url: `${BASE_URL}/tu-vi/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const starUrls: MetadataRoute.Sitemap = ALL_STARS_CONTENT.map((s) => ({
    url: `${BASE_URL}/tu-vi/sao/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.55,
  }));

  const core: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // NOTE: noindex pages are intentionally NOT listed here — /onboarding, /decisions/new,
    // /journal/new, /affiliate/assets all set `robots.index:false`, so listing them in the
    // sitemap is a conflicting signal (Google: "Submitted URL marked noindex"). Don't re-add.
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/community`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/hoi-dap`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/changelog`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    // /legal bỏ khỏi sitemap + đặt noindex (hub mỏng trùng cột Pháp lý footer).
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/learn/tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/bat-tu`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/than-so-hoc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/mbti`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/big-five`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/disc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/enneagram`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/palm`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/kinh-dich`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/tarot`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/phong-thuy`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/chiem-tinh`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/hop-tuoi`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/con-giap`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/sao-han`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/trach-cat`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/can-xuong`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/dat-ten-ngu-hanh`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/tu-vi-hom-nay`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/lich-van-nien`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/than-so-hoc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    // Thư viện ý nghĩa 12 số chủ đạo — evergreen SEO (lane nâng cấp dữ liệu mỏng 2026-06).
    { url: `${BASE_URL}/than-so-hoc/y-nghia`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...SO_CHU_DAO.map((n) => ({
      url: `${BASE_URL}/than-so-hoc/y-nghia/${n.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Thư viện 4 loại số thần số học — Vận mệnh, Linh hồn, Nhân cách, Ngày sinh (2026-06).
    { url: `${BASE_URL}/than-so-hoc/cac-loai-so`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    ...LOAI_SO.map((l) => ({
      url: `${BASE_URL}/than-so-hoc/cac-loai-so/${l.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${BASE_URL}/hop-tuoi`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/can-xuong`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/thuoc-lo-ban`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/xem-tuong`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/ban-do-sao`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/la-so-tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/bang-chung`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/bang-chung/do-chinh-xac`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/la-so-bat-tu`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const tuviHub: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/tu-vi`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/tu-vi/rectify`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/sample-report`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tu-vi-2026`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/tu-vi-2027`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/tu-vi-nghe-nghiep`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/tu-vi-tinh-yeu`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/tu-vi-tai-chinh`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/tinh-menh-cuc`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/dai-van-hien-tai`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Wave 5 — Decision system pages (problem-first entry points + methodology + dashboard).
  const decisionSystem: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/lo-trinh`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/lo-trinh/hieu-ban-than`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    // Gộp (B) 2026-06-21: su-nghiep/tinh-cam/hang-ngay redirect 301 → /tu-vi-* → bỏ khỏi sitemap.
    { url: `${BASE_URL}/lo-trinh/ke-hoach-nam`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/ban-do`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/decisions`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },    { url: `${BASE_URL}/methodology/tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/methodology/algorithm-changelog`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
  ];

  // Wave 6 — Retention features + new compat/career tools.
  const retentionTools: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/journal`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },    { url: `${BASE_URL}/weekly-review`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/compatibility`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/xem-hop-nhom`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/career-fit`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
  ];

  // Wave 7 — Methodology supporting + planning + simulator + family.
  const wave7: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/methodology/model-card`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/methodology/ai-safety`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/methodology/bat-tu`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/monthly-planning`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/annual-planning`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/timeline`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/decision-simulator`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/family-profiles`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
  ];

  // Affiliate program — public-facing pages (single-tier referral). The
  // /network + /leaderboard routes were retired (redirect + noindex), so they
  // are intentionally absent here.
  const wave9: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/affiliate`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/affiliate/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/affiliate/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  // Daily / reading additions.
  // SEO-FIX: /brand removed — it is robots:noindex (internal brand/design-system
  // reference), so listing it in the sitemap caused Ahrefs "Noindex page in
  // sitemap" + kept it flagged as an orphan. A noindex page must not be in the
  // sitemap. If /brand is ever made public again, re-add it here and drop noindex.
  const waveAdditions: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/lich-van-nien/today`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
    { url: `${BASE_URL}/lich-van-nien/ngay-tot-xau`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE_URL}/reading`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/thien-van`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Dynamic zodiac daily entries.
  const ZODIAC_LIST = ['ty','suu','dan','mao','thin','ti','ngo','mui','than','dau','tuat','hoi'];
  const zodiacDailyUrls: MetadataRoute.Sitemap = ZODIAC_LIST.map((z) => ({
    url: `${BASE_URL}/tu-vi-hom-nay/${z}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.55,
  }));

  // Wave 13 — Community case studies (§8.6).
  const caseStudyUrls: MetadataRoute.Sitemap = listCaseStudies().map((c) => ({
    url: `${BASE_URL}/community/cases/${c.slug}`,
    lastModified: new Date(c.publishedAt),
    changeFrequency: 'yearly' as const,
    priority: 0.55,
  }));
  const wave13: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/community/cases`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...caseStudyUrls,
  ];

  // Wave 38.4 audit additions — surface hidden SEO pages to Google Search Console.
  // P1 fix: 4 hop-tuoi sub-types + 12 palace deep-dives + newsletter were missing.
  const wave38Additions: MetadataRoute.Sitemap = [
    // /hop-tuoi/wedding gộp vào /xem-tuoi-cuoi (redirect 308) → bỏ khỏi sitemap.
    { url: `${BASE_URL}/hop-tuoi/business`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/hop-tuoi/birth-child`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/hop-tuoi/xong-dat`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/newsletter`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Wave 60.96.5 — audit found 4 audience landings + 1 sample preview were
  // shipped (Wave 60.95.u + 60.95.m) but never added to sitemap. Without
  // these entries Google Search Console can't discover them and the OG/
  // BreadcrumbList/Article schema added in Wave 60.96.{1..4} never reaches
  // the SERP rich-snippet pipeline.
  const wave60_96Additions: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/bat-tu`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/mbti`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/newsletter/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    // NOTE: /reading/sample-tu-vi removed from sitemap — it lives under /reading/
    // which robots.ts disallows, so sitemapping it produced a "Submitted URL
    // blocked by robots.txt" conflict in GSC. /sample-report (above) is the
    // canonical public sample. (Site-structure audit 2026-06-21.)
    // Wave 60.98-FE — pillar index + dynamic per-article URLs.
    { url: `${BASE_URL}/cam-nang`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
  ];
  const learnPalaceUrls: MetadataRoute.Sitemap = PALACE_READINGS.map((p) => ({
    url: `${BASE_URL}/learn/tu-vi/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Đợt 0 big-upgrade — bật các engine đã build sẵn (Kinh Dịch, Big Five, DISC).
  const dot0Tools: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/gieo-que`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    // Thư viện ý nghĩa 64 quẻ Kinh Dịch — evergreen SEO (nâng cấp dữ liệu mỏng 2026-06).
    { url: `${BASE_URL}/gieo-que/y-nghia`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...QUE_PAGES.map((q) => ({
      url: `${BASE_URL}/gieo-que/y-nghia/${q.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${BASE_URL}/big-five`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/disc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/enneagram`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/tu-kiem`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/tarot`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/tarot/hom-nay`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    // Thư viện ý nghĩa lá Tarot (đủ 78 lá: 22 Ẩn chính + 56 Ẩn phụ) — evergreen SEO.
    { url: `${BASE_URL}/tarot/y-nghia`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...TAROT_PAGES.map((c) => ({
      url: `${BASE_URL}/tarot/y-nghia/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${BASE_URL}/sao-han`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/cong-cu`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Xem ngày tốt theo mục đích — SEO landings (engine: worker /tools/lich-van-nien/check).
  const xemNgay: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/xem-ngay`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/tra-cuu-tuoi`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/luc-thap-hoa-giap`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tuong-hop-12-con-giap`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/thang-co-hon-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/xuat-hanh-2027`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/xuat-hanh`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    ...PURPOSES.map((p) => ({
      url: `${BASE_URL}/xem-ngay/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // Dynamic cam-nang article URLs — fetched from the worker public endpoint.
  // Graceful: if the API is down, sitemap still serves all static URLs.
  let pillarUrls: MetadataRoute.Sitemap = [];
  try {
    const r = await fetch(`${API_BASE}/content/public/pillars`, { next: { revalidate: 3600 } });
    if (r.ok) {
      const data = (await r.json()) as { pillars?: Array<{ slug: string; published_at: string | null }> };
      pillarUrls = (data.pillars ?? []).map((p) => ({
        url: `${BASE_URL}/cam-nang/${p.slug}`,
        lastModified: p.published_at ? new Date(p.published_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch { /* non-fatal */ }

  // Hợp tuổi 12 con giáp theo cặp — chỉ liệt kê bản canonical (đã sort) để tránh
  // trùng nội dung: 78 cặp (66 khác tuổi + 12 cùng tuổi) + trang hub.
  const seenPair = new Set<string>();
  const hopTuoiPairUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/hop-tuoi/tuoi`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
  ];
  for (const za of ZODIAC) {
    for (const zb of ZODIAC) {
      const slug = canonicalPairSlug(za.slug, zb.slug);
      if (seenPair.has(slug)) continue;
      seenPair.add(slug);
      hopTuoiPairUrls.push({
        url: `${BASE_URL}/hop-tuoi/tuoi/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      });
    }
  }

  // Sao hạn theo từng con giáp (12 trang SEO mùa vụ).
  const saoHanTuoi: MetadataRoute.Sitemap = [
    'ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi',
  ].map((t) => ({
    url: `${BASE_URL}/sao-han/${t}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Tử Vi 2026 theo từng con giáp (12 trang SEO mùa vụ Tết — dữ liệu deterministic).
  const tuVi2026ConGiap: MetadataRoute.Sitemap = ZODIAC_LIST.map((t) => ({
    url: `${BASE_URL}/tu-vi-2026/${t}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const tuVi2027ConGiap: MetadataRoute.Sitemap = ZODIAC_LIST.map((t) => ({
    url: `${BASE_URL}/tu-vi-2027/${t}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Cung hoàng đạo (chiêm tinh phương Tây) — hub + 12 cung. Deterministic SSG.
  const cungHoangDaoUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/cung-hoang-dao`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...CUNG_SLUGS.map((s) => ({
      url: `${BASE_URL}/cung-hoang-dao/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // Ngũ hành bản mệnh theo năm sinh — hub + 1 trang/năm (1950–2026). Deterministic SSG.
  const banMenhUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/ban-menh`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...BAN_MENH_YEARS.map((y) => ({
      url: `${BASE_URL}/ban-menh/${y}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];

  // Tam Tai (phong tục Can Chi) — hub + 12 con giáp. Deterministic SSG.
  const tamTaiUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/tam-tai`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...TAM_TAI_SLUGS.map((s) => ({
      url: `${BASE_URL}/tam-tai/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // Kim Lâu (phong tục cưới hỏi) — 1 landing (hub + finder). Deterministic.
  const kimLauUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/kim-lau`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Màu xe hợp mệnh (phong thủy ngũ hành) — 1 landing (hub + finder). Deterministic.
  const mauXeUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/mau-xe-hop-menh`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Hướng bàn làm việc / bàn học (Bát Trạch) — 1 landing (hub + finder). Deterministic.
  const huongBanUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/huong-ban-lam-viec`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Độ hợp cung hoàng đạo — hub + 78 cặp (unordered). Deterministic SSG.
  const cungHopUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/cung-hoang-dao/hop`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...CUNG_HOP_PAIRS.map((p) => ({
      url: `${BASE_URL}/cung-hoang-dao/hop/${p}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // Enneagram — trang chi tiết 9 nhóm (/learn/enneagram/[1..9]). Deterministic SSG.
  const enneagramTypeUrls: MetadataRoute.Sitemap = ENNEAGRAM_SLUGS.map((t) => ({
    url: `${BASE_URL}/learn/enneagram/${t}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 12 Con Giáp — trang chi tiết 12 con giáp (/learn/con-giap/[slug]). Deterministic SSG.
  const conGiapUrls: MetadataRoute.Sitemap = CON_GIAP_SLUGS.map((s) => ({
    url: `${BASE_URL}/learn/con-giap/${s}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // MBTI — trang chi tiết 16 nhóm (/learn/mbti/[code]). Deterministic SSG.
  const mbtiTypeUrls: MetadataRoute.Sitemap = MBTI_SLUGS.map((t) => ({
    url: `${BASE_URL}/learn/mbti/${t}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // DISC — trang chi tiết 4 nhóm hành vi (/learn/disc/[d|i|s|c]). Deterministic SSG.
  const discTypeUrls: MetadataRoute.Sitemap = DISC_SLUGS.map((t) => ({
    url: `${BASE_URL}/learn/disc/${t}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Big Five (OCEAN) — trang chi tiết 5 chiều (/learn/big-five/[trait]). Deterministic SSG.
  const bigFiveTraitUrls: MetadataRoute.Sitemap = BIG_FIVE_SLUGS.map((t) => ({
    url: `${BASE_URL}/learn/big-five/${t}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Trang so sánh lăng kính (MBTI vs Big Five, Tử Vi vs Bát Tự, MBTI vs DISC) + hub.
  const soSanhUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/so-sanh`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    ...COMPARISONS.map((c) => ({
      url: `${BASE_URL}/so-sanh/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // Ngày kiêng kỵ dân gian (Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật) — SEO mùa vụ.
  const ngayKiengKy: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ngay-kieng-ky`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Giờ hoàng đạo — SEO mùa vụ (giờ tốt trong ngày).
  const gioHoangDao: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/gio-hoang-dao`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    // Thư viện ý nghĩa 12 sao giờ — evergreen SEO (lane nâng cấp dữ liệu mỏng 2026-06).
    { url: `${BASE_URL}/gio-hoang-dao/y-nghia`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...SAO_GIO.map((s) => ({
      url: `${BASE_URL}/gio-hoang-dao/y-nghia/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // Xem tuổi cưới theo năm sinh — SEO mùa cưới (Kim Lâu / Tam Tai / xung năm).
  const xemTuoiCuoi: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/xem-tuoi-cuoi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...BIRTH_YEARS.map((y) => ({
      url: `${BASE_URL}/xem-tuoi-cuoi/${slugOf(y)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ];

  // Đặt tên con theo ngũ hành — SEO (mệnh nạp âm + gợi ý tên).
  const datTenNguHanh: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/dat-ten-ngu-hanh`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...VARIANTS.map((v) => ({
      url: `${BASE_URL}/dat-ten-ngu-hanh/${v.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ];

  // Sinh con theo năm — SEO (mệnh của bé + đối chiếu tuổi bố mẹ).
  const sinhCon: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/sinh-con`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...SINH_CON_VARIANTS.map((v) => ({
      url: `${BASE_URL}/sinh-con/${v.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ];

  // Xem tuổi làm nhà theo năm sinh — SEO mùa xây dựng (Kim Lâu / Hoang Ốc / Tam Tai).
  const lamNha: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/xem-tuoi-lam-nha`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...LAM_NHA_BIRTH_YEARS.map((y) => ({
      url: `${BASE_URL}/xem-tuoi-lam-nha/${lamNhaSlugOf(y)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ];

  // Tuổi xông đất Tết Đinh Mùi 2027 — SEO mùa Tết (tam hợp/lục hợp + ngũ hành).
  const xongDat: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/xong-dat`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...XONG_DAT_YEARS.map((y) => ({
      url: `${BASE_URL}/xong-dat/${xongDatSlug(y)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ];

  // Xem tuổi khai trương / mở hàng theo năm sinh chủ — SEO (Tam Tai / xung Thái Tuế).
  const khaiTruong: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/khai-truong`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...KHAI_TRUONG_YEARS.map((y) => ({
      url: `${BASE_URL}/khai-truong/${khaiTruongSlug(y)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ];

  // Xem hướng nhà hợp tuổi — SEO phong thủy (Bát Trạch / cung phi theo năm sinh).
  const huongNha: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/huong-nha`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...HUONG_NHA_YEARS.map((y) => ({
      url: `${BASE_URL}/huong-nha/${huongNhaSlug(y)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  const allRoutes = [...core, ...tuviHub, ...palaceUrls, ...starUrls, ...decisionSystem, ...retentionTools, ...wave7, ...wave9, ...waveAdditions, ...zodiacDailyUrls, ...wave13, ...wave38Additions, ...wave60_96Additions, ...learnPalaceUrls, ...dot0Tools, ...xemNgay, ...saoHanTuoi, ...ngayKiengKy, ...gioHoangDao, ...datTenNguHanh, ...xemTuoiCuoi, ...sinhCon, ...lamNha, ...xongDat, ...khaiTruong, ...huongNha, ...tuVi2026ConGiap, ...tuVi2027ConGiap, ...pillarUrls, ...hopTuoiPairUrls, ...soSanhUrls, ...cungHoangDaoUrls, ...banMenhUrls, ...tamTaiUrls, ...kimLauUrls, ...mauXeUrls, ...huongBanUrls, ...cungHopUrls, ...enneagramTypeUrls, ...conGiapUrls, ...mbtiTypeUrls, ...discTypeUrls, ...bigFiveTraitUrls];
  // S10 mùa vụ: rụng trang thời-điểm đã hết hạn khỏi sitemap (vẫn giữ file).
  return allRoutes.filter((e) => expiredSeasonalTarget(e.url.replace(BASE_URL, '')) === null);
}

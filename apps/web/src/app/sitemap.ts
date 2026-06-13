import type { MetadataRoute } from 'next';
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
import { SAO_GIO } from '@/lib/gio-hoang-dao-stars';

const BASE_URL = 'https://hieu.asia';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

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
    { url: `${BASE_URL}/onboarding`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/community`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/hoi-dap`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/changelog`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/learn/tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/bat-tu`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/than-so-hoc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/mbti`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/big-five`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/disc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/enneagram`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/palm`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
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
    { url: `${BASE_URL}/hop-tuoi`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/can-xuong`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/thuoc-lo-ban`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/xem-tuong`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/ban-do-sao`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/la-so-tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
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
    { url: `${BASE_URL}/lo-trinh/su-nghiep`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/lo-trinh/tinh-cam`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/lo-trinh/ke-hoach-nam`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/lo-trinh/hang-ngay`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/ban-do`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/decisions`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/decisions/new`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/methodology/tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/methodology/algorithm-changelog`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
  ];

  // Wave 6 — Retention features + new compat/career tools.
  const retentionTools: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/journal`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/journal/new`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/weekly-review`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
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

  // Wave 8/9 — Multi-tier affiliate hubs (public-facing landing).
  const wave9: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/affiliate`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/affiliate/network`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/affiliate/commissions`, lastModified: now, changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE_URL}/affiliate/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/affiliate/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/affiliate/leaderboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/affiliate/assets`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
  ];

  // Daily / reading / brand additions.
  const waveAdditions: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/lich-van-nien/today`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
    { url: `${BASE_URL}/lich-van-nien/ngay-tot-xau`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE_URL}/reading`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/brand`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
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
    { url: `${BASE_URL}/hop-tuoi/wedding`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
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
    { url: `${BASE_URL}/reading/sample-tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
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

  return [...core, ...tuviHub, ...palaceUrls, ...starUrls, ...decisionSystem, ...retentionTools, ...wave7, ...wave9, ...waveAdditions, ...zodiacDailyUrls, ...wave13, ...wave38Additions, ...wave60_96Additions, ...learnPalaceUrls, ...dot0Tools, ...xemNgay, ...saoHanTuoi, ...ngayKiengKy, ...gioHoangDao, ...datTenNguHanh, ...xemTuoiCuoi, ...sinhCon, ...lamNha, ...xongDat, ...khaiTruong, ...huongNha, ...pillarUrls, ...hopTuoiPairUrls, ...soSanhUrls];
}

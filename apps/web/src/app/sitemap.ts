import type { MetadataRoute } from 'next';
import { PALACES_CONTENT, ALL_STARS_CONTENT } from '@/lib/tuvi-content';
import { listCaseStudies } from '@/lib/case-studies';
import { PALACE_READINGS } from '@/lib/palace-readings';

const BASE_URL = 'https://hieu.asia';

export default function sitemap(): MetadataRoute.Sitemap {
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
    { url: `${BASE_URL}/changelog`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/legal`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/learn/tu-vi`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/bat-tu`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/than-so-hoc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/mbti`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/learn/palm`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/tu-vi-hom-nay`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/lich-van-nien`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/than-so-hoc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/hop-tuoi`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/can-xuong`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/thuoc-lo-ban`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/big-five`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/disc`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
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
    // Wave 60.98-FE — pillar index. Per-slug pillars are generated by the
    // worker public endpoint and discovered organically; no need to enumerate
    // here (Google will crawl them from the index).
    { url: `${BASE_URL}/cam-nang`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
  ];
  const learnPalaceUrls: MetadataRoute.Sitemap = PALACE_READINGS.map((p) => ({
    url: `${BASE_URL}/learn/tu-vi/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...core, ...tuviHub, ...palaceUrls, ...starUrls, ...decisionSystem, ...retentionTools, ...wave7, ...wave9, ...waveAdditions, ...zodiacDailyUrls, ...wave13, ...wave38Additions, ...wave60_96Additions, ...learnPalaceUrls];
}

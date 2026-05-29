import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Wave 60.60.b — SEO + GEO (AI search) policy.
  //
  // Strategic reversal of Wave 52 BUG-025 opt-OUT stance:
  // VN astrology category đang định hình; muốn hieu.asia được trích dẫn khi user
  // hỏi ChatGPT/Claude/Perplexity/Gemini "tử vi AI tiếng Việt là gì",
  // "ai làm Bát Tự bằng AI", v.v. Để được citable, AI crawlers cần được phép
  // index public marketing/learn pages. Private pages (account/dashboard/api)
  // vẫn block bằng catchall path-level disallow.
  //
  // Tradeoff đã chấp nhận: nội dung public có thể bị dùng vào training corpus.
  // Mitigation: nội dung trên public pages đã là marketing material (đã public).
  // Private user data (reading/onboarding/account/api) vẫn 100% block.
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/reading/',
          '/unlock/',
          '/dashboard/',
          '/account',
          '/settings',
          '/signin',
          '/auth/',
          '/onboarding/',
          // Wave 64 — thin-content / near-duplicate / dead-shell routes.
          '/checkout/',         // thanh toán thin-content ("Sắp ra mắt")
          '/r/',                // affiliate referral redirect (near-duplicate)
          '/onboarding-wizard', // shell rỗng "Đang chuẩn bị…" (Wave 58 in-flight)
          // Wave 6 — private detail URLs (localStorage-only, would soft-404 for crawlers)
          '/decisions/d_',
          '/journal/jr_',
        ],
      },
      // Wave 60.60.b — explicit allow for AI search & answer engines (GEO).
      // Same path-level disallow as catchall applies (private routes blocked).
      // Order in robots.txt: more-specific UA blocks override the wildcard
      // catchall, so we must repeat the disallow list per AI UA family.
      {
        userAgent: [
          'GPTBot',           // OpenAI training + GPT browsing
          'ChatGPT-User',     // OpenAI in-chat fetch
          'OAI-SearchBot',    // OpenAI SearchGPT index
          'anthropic-ai',     // Anthropic legacy UA
          'ClaudeBot',        // Anthropic newer UA
          'Claude-Web',       // Anthropic in-chat fetch
          'Google-Extended',  // Google Gemini/Bard training corpus
          'CCBot',            // Common Crawl (feeds many LLMs)
          'PerplexityBot',    // Perplexity answer engine
          'Applebot-Extended',// Apple Intelligence / Siri
          'cohere-ai',        // Cohere training
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/reading/',
          '/unlock/',
          '/dashboard/',
          '/account',
          '/settings',
          '/signin',
          '/auth/',
          '/onboarding/',
          // Wave 64 — thin-content / near-duplicate / dead-shell routes.
          '/checkout/',
          '/r/',
          '/onboarding-wizard',
          '/decisions/d_',
          '/journal/jr_',
        ],
      },
      // High-volume / low-citation crawlers — keep blocked.
      // Bytespider (Doubao) + Amazonbot scrape aggressively without driving
      // material discovery traffic for a VN-language brand.
      // Meta agents: training corpus only (no Meta-AI search citation path
      // yet at Wave 60.60.b time of writing).
      {
        userAgent: [
          'Bytespider',
          'Amazonbot',
          'FacebookBot',
          'Meta-ExternalAgent',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://hieu.asia/sitemap.xml',
    host: 'https://hieu.asia',
  };
}

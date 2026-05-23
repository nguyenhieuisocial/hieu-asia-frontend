import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
          // Wave 6 — private detail URLs (localStorage-only, would soft-404 for crawlers)
          '/decisions/d_',
          '/journal/jr_',
        ],
      },
      // BUG-025 (Wave 52, #263): block all training-corpus AI crawlers.
      // Policy: opt-OUT of training corpora; indexing crawlers (Googlebot/
      // Bingbot/etc.) stay allowed via the catchall rule above. Each entry
      // is the well-documented robots.txt token for that crawler:
      // - OpenAI:       GPTBot                  https://platform.openai.com/docs/gptbot
      // - OpenAI legacy: ChatGPT-User           in-chat browse (still trains)
      // - OpenAI search: OAI-SearchBot          search index (gray-area)
      // - Anthropic:    anthropic-ai            https://support.anthropic.com/.../robots-txt
      // - Anthropic:    ClaudeBot               newer UA; opt-out same family
      // - Anthropic:    Claude-Web              in-chat fetch (still trains)
      // - Google:       Google-Extended         opt-out of Gemini/Bard training
      // - Common Crawl: CCBot                   training data scraper many LLMs
      // - Perplexity:   PerplexityBot           https://docs.perplexity.ai/.../crawler
      // - Meta:         FacebookBot, Meta-ExternalAgent
      // - Amazon:       Amazonbot               Alexa/Q training
      // - ByteDance:    Bytespider              Doubao training (high-volume in VN)
      // - Cohere:       cohere-ai
      // - Apple:        Applebot-Extended       opt-out of Siri training (allow Applebot indexing)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'anthropic-ai',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
          'CCBot',
          'PerplexityBot',
          'FacebookBot',
          'Meta-ExternalAgent',
          'Amazonbot',
          'Bytespider',
          'cohere-ai',
          'Applebot-Extended',
        ],
        disallow: '/',
      },
    ],
    sitemap: 'https://hieu.asia/sitemap.xml',
    host: 'https://hieu.asia',
  };
}

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import { withBotId } from 'botid/next/config';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hieu-asia/ui', '@hieu-asia/types', '@hieu-asia/api-client'],
  // 2026-06-30 — Vercel build OOM fix. `next build` re-runs ESLint + full tsc
  // ("Linting and checking validity of types"), which OOM-killed the web deploy
  // on Vercel's build container. The CI job "turbo lint + test + build" already
  // enforces lint + types on every PR before merge, so the in-build re-check is
  // redundant; skipping it cuts peak build memory. Quality gate stays in CI.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    typedRoutes: true,
    // Inline CSS into <head> instead of a render-blocking <link>. App-Router-
    // native, well-suited to Tailwind's single atomic stylesheet → removes the
    // CSS request from the critical path (homepage LCP was gated by a ~195KB
    // render-blocking stylesheet that is legitimately sized, not trimmable).
    // Verified via prod build + Chromatic visual regression + Lighthouse;
    // single reversible flag.
    inlineCss: true,
  },
  // Wave 55 + V4-FIX BUG-044. Force blocking <head> metadata for:
  //   1. unfurl/preview bots → complete OG tags before any streamed body
  //   2. SEO/a11y/validator tools (Lighthouse, axe-core, W3C nu, curl) →
  //      title appears in <head> not <body>, satisfies W3C "title not
  //      allowed as child of body" + "head missing title" errors
  //   3. AI crawlers (GPTBot, ClaudeBot, Perplexity, CCBot) → consistent
  //      metadata indexing
  //
  // Specifying this option OVERRIDES the Next.js default list. This regex
  // expands the default (`node_modules/next/dist/shared/lib/router/utils/
  // html-bots.js`) with:
  //   - validator.w3.org user agents (`Validator.nu`, `W3C_Validator`)
  //   - Lighthouse + Lighthouse-CI (already had Chrome-Lighthouse — kept)
  //   - generic `curl/` and `wget/` (audit/CI/manual smoke tests should
  //     see canonical static HTML, not a streamed shell)
  //   - axe-core's Puppeteer UA fingerprint
  //   - Modern AI crawlers (Claude-Web/ClaudeBot, GPTBot, PerplexityBot,
  //     OAI-SearchBot, CCBot, AnthropicBot) for stable indexing
  //
  // We do NOT use `/.*/ ` (all-UAs) per V4 report — that would disable
  // streaming for real users and crater TTFB. Targeted whitelist keeps
  // browser users on the streaming fast path while audit/bot traffic gets
  // static head-first HTML.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|TelegramBot|Validator\.nu|W3C_Validator|curl\/|wget\/|axe-core|HeadlessChrome|GPTBot|ClaudeBot|Claude-Web|PerplexityBot|OAI-SearchBot|CCBot|AnthropicBot/i,
  async redirects() {
    return [
      // Vanity / legacy URL aliases — keep canonical Vietnamese slugs.
      { source: '/learn/numerology', destination: '/learn/than-so-hoc', permanent: true },
      { source: '/numerology', destination: '/than-so-hoc', permanent: true },
      { source: '/learn/bazi', destination: '/learn/bat-tu', permanent: true },
      { source: '/learn/zi-wei', destination: '/learn/tu-vi', permanent: true },
      { source: '/learn/ziwei', destination: '/learn/tu-vi', permanent: true },
      { source: '/palm', destination: '/learn/palm', permanent: true },
      // Legal hub aliases
      { source: '/legal/privacy', destination: '/privacy', permanent: true },
      { source: '/legal/terms', destination: '/terms', permanent: true },
      // Retired legacy "Wave 44" partner portal (/partner/*). It still rendered a
      // multi-tier (L1/L2/L3/L4+) downline "subtree" UI — the exact downline-payout
      // model we do NOT run (commission is SINGLE-TIER; only the direct referrer
      // earns). Advertising multi-tier implies an unregistered MLM (Nghị định
      // 40/2018) — a legal + trust risk. The same fix was already applied to the
      // twin /affiliate/network route; /partner was missed. De-linked from all nav;
      // superseded by /affiliate/*. Temporary (307) pending final delete decision.
      { source: '/partner', destination: '/affiliate', permanent: false },
      { source: '/partner/:path*', destination: '/affiliate', permanent: false },
      // Consolidate duplicate sample pages → /sample-report is the canonical
      // public sample (linked everywhere, priority 0.8). /reading/sample-tu-vi
      // was a teaser that never worked (sits under robots-blocked /reading/, 0
      // internal links). 308 → /sample-report. (Site-structure audit 2026-06-21.)
      { source: '/reading/sample-tu-vi', destination: '/sample-report', permanent: true },
      // Gộp 2 trang cưới hỏi (audit cấu trúc 2026-06-21): /xem-tuoi-cuoi nay là
      // trang "Cưới hỏi" trọn vẹn (năm cưới + hợp tuổi vợ chồng nhúng sẵn). Trang
      // hợp-tuổi-cưới riêng dồn về đó. (Các loại hợp tuổi khác vẫn ở /hop-tuoi/*.)
      { source: '/hop-tuoi/wedding', destination: '/xem-tuoi-cuoi', permanent: true },
      // Gộp (B) 2026-06-21: hệ "nhu cầu" /lo-trinh/* trùng nội dung hệ "bộ môn"
      // /tu-vi-* (tự cạnh tranh từ khóa). Dồn về /tu-vi-* canonical (đã bê lá số
      // thật + Decision Brief sang đó). GIỮ /lo-trinh (hub) + /lo-trinh/hieu-ban-than
      // (độc quyền) + /lo-trinh/ke-hoach-nam (evergreen, không có đích tu-vi sạch).
      { source: '/lo-trinh/su-nghiep', destination: '/tu-vi-nghe-nghiep', permanent: true },
      { source: '/lo-trinh/tinh-cam', destination: '/tu-vi-tinh-yeu', permanent: true },
      { source: '/lo-trinh/hang-ngay', destination: '/tu-vi-hom-nay', permanent: true },
    ];
  },
  async rewrites() {
    // (Removed dead /favicon.ico → /icon rewrite: app/icon route no longer
    // exists; public/favicon.ico is served directly. Site-structure audit.)
    return [];
  },
  async headers() {
    // Content-Security-Policy — allows: self + Vercel/Supabase + Cloudflare API + PostHog + Sentry + fonts.
    // `'unsafe-inline'` on script-src needed for Next.js inline bootstrap scripts (build IDs etc.).
    // `'unsafe-eval'` is required by Next.js dev mode (Fast Refresh) but MUST NOT ship to prod.
    const isDev = process.env.NODE_ENV === 'development';
    // Wave 41.4 — pixel host allowlists. Marketing pixels are consent-gated
    // at runtime (only injected after CMP opt-in), but CSP must allow the
    // hosts up-front or the browser blocks the script tag before our gate
    // can run anything. Hosts:
    //   Meta Pixel:    connect.facebook.net (JS), *.facebook.com (img/conn)
    //   Google Ads:    googletagmanager.com (JS), googleadservices.com + google.com (conn/img)
    //   TikTok Pixel:  analytics.tiktok.com (JS+conn)
    const pixelScriptHosts = 'https://connect.facebook.net https://www.googletagmanager.com https://analytics.tiktok.com';
    const pixelConnectHosts = 'https://*.facebook.com https://www.googleadservices.com https://www.google-analytics.com https://www.google.com https://analytics.tiktok.com';
    const pixelImgHosts = 'https://*.facebook.com https://www.google.com https://www.googleadservices.com https://www.google-analytics.com';

    const scriptSrc = [
      // Wave 60.80.fix — added 'wasm-unsafe-eval' to allow dotlottie-web
      // WebAssembly.instantiate() for Lottie animations. Without it, browser
      // blocks WASM compilation with CSP error surfaced in Lighthouse
      // errors-in-console audit.
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
      isDev ? "'unsafe-eval'" : '',
      'https://us.i.posthog.com https://*.posthog.com https://browser.sentry-cdn.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io',
      // Wave 60.29 — Vercel Speed Insights script. Pre-existing gap on web app
      // CSP (since Wave 41.4) caught when adding admin CSP this wave. Without
      // this, `@vercel/speed-insights/next` is CSP-blocked silently → Wave 59
      // Speed Insights produces zero metrics on web.
      'https://va.vercel-scripts.com',
      // Wave 60.62 — Cloudflare Turnstile captcha (Wave 60.60.d wired
      // TurnstileWidget on /signin). CSP must allow script-src for
      // `challenges.cloudflare.com/turnstile/v0/api.js` to execute, otherwise
      // `window.turnstile` never defined and widget never renders → Supabase
      // signin fails because no captchaToken passed. Caught Wave 60.62.verify
      // Playwright check (browser console "violates CSP directive").
      'https://challenges.cloudflare.com',
      // Google Translate widget (ngôn ngữ mọi quốc gia, như ifan.asia) —
      // element.js + its sub-scripts load from these hosts; without them the
      // CSP blocks the widget silently.
      'https://translate.google.com https://translate.googleapis.com https://www.gstatic.com',
      pixelScriptHosts,
    ]
      .filter(Boolean)
      .join(' ');
    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      `img-src 'self' data: blob: https: ${pixelImgHosts}`,
      // Wave 60.80.fix — added unpkg.com + cdn.jsdelivr.net for dotlottie WASM
      // fallback fetches. Lighthouse best-practices flagged CSP-blocked errors
      // when primary WASM source failed; library retries from these CDNs.
      `connect-src 'self' https://api.hieu.asia https://*.hieu.asia https://*.supabase.co https://*.supabase.in https://us.i.posthog.com https://*.posthog.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://cloud.langfuse.com https://api.vietqr.io https://unpkg.com https://cdn.jsdelivr.net https://translate.googleapis.com https://translate.google.com ${pixelConnectHosts}`,
      // Wave 60.62 — Cloudflare Turnstile renders its widget inside an iframe
      // hosted at challenges.cloudflare.com — must allow frame-src in addition
      // to script-src above. Both needed for captcha to work.
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com https://translate.google.com",
      // Wave 60.80.fix — allow blob: workers for libraries that spawn Web
      // Workers via Blob URLs (e.g. dotlottie internal worker). Lighthouse
      // surfaced "Creating a worker from 'blob:...' violates CSP".
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ');
    // Wave 60.50.a — Cache-Control for marketing routes to enable browser
    // back/forward cache (bf-cache). bf-cache requires Cache-Control to NOT
    // be `no-store`. `public, max-age=0, must-revalidate` tells the browser
    // to revalidate on every load but still allow bf-cache restoration on
    // back-nav (instant restore from in-memory snapshot).
    // Authed/dynamic routes keep their per-route `no-store` from API handlers.
    const marketingCacheControl = 'public, max-age=0, must-revalidate';
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // Marketing routes — enable bf-cache for instant back-nav.
      {
        source: '/',
        headers: [{ key: 'Cache-Control', value: marketingCacheControl }],
      },
      {
        source: '/pricing',
        headers: [{ key: 'Cache-Control', value: marketingCacheControl }],
      },
      {
        source: '/features',
        headers: [{ key: 'Cache-Control', value: marketingCacheControl }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.hieu.asia' },
      { protocol: 'https', hostname: 'img.vietqr.io' },
      { protocol: 'https', hostname: 'api.vietqr.io' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Performance budget: warn on chunks > 250kB.
  webpack(config, { isServer }) {
    if (!isServer) {
      config.performance = {
        ...config.performance,
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        maxAssetSize: 250_000,
        maxEntrypointSize: 250_000,
      };
    }
    return config;
  },
};

// Wave 55 — wrap with Vercel BotID. `withBotId` injects the proxy rewrites
// the BotID client needs to attach classification headers. Server check lives
// in route handlers via `checkBotId()` from 'botid/server'. The client init
// is in `src/instrumentation-client.ts` — keep the protect list there in
// sync with route handlers that call checkBotId.
export default withBotId(
  withSentryConfig(withBundleAnalyzer(withNextIntl(nextConfig)), {
    silent: true,
    org: 'hieuasia',
    project: 'hieu-asia-web',
    // Wave 60.94.l — authToken from Vercel env enables source-map upload
    // at build time. Token is sntryu_* user auth token created Wave 60.93.
    // Without it, source maps generate but are NOT uploaded to Sentry,
    // leaving production stack traces unminified. authToken is read-only
    // server-side env (NEVER expose to browser).
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // Wave 60.95.w — Releases + deploy tracking. Three jobs:
    //   1. `name` — pins the release identifier to the deploy's commit SHA
    //      (matches the runtime `release` in sentry.{client,server,edge}.config.ts).
    //      Vercel sets VERCEL_GIT_COMMIT_SHA at build time; we read it server-
    //      side here (next.config runs in Node, not the browser, so the
    //      non-NEXT_PUBLIC variant works and is safer). Fallback chain handles
    //      preview deploys that still expose only NEXT_PUBLIC_* and local builds.
    //   2. `setCommits.auto: true` — annotates the release with every commit
    //      since the previous release in Sentry. Lets the "Suspect Commits"
    //      feature attribute new errors to the actual code change.
    //      `ignoreMissing: true` prevents build failure on the FIRST release
    //      (no previous release exists yet → would otherwise abort).
    //   3. `deploy.env` — marks the release as deployed to production/preview
    //      so Sentry's "Release Health" tab can compute crash-free-sessions
    //      per environment. We skip `url` here because the Vercel deploy URL
    //      isn't available at build time (build runs BEFORE deployment URL
    //      is assigned); founder can drill into the deploy via the commit SHA
    //      shown on the release page.
    // When SENTRY_AUTH_TOKEN is missing (local builds), withSentryConfig skips
    // the entire release upload phase, so this config is safe in dev.
    release: {
      name:
        process.env.VERCEL_GIT_COMMIT_SHA ??
        process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
        undefined,
      setCommits: {
        auto: true,
        ignoreMissing: true,
        ignoreEmpty: true,
      },
      deploy: {
        env:
          process.env.VERCEL_ENV === 'production'
            ? 'production'
            : process.env.VERCEL_ENV === 'preview'
              ? 'preview'
              : 'development',
      },
    },
    // Wave 60.50.a — Sentry payload reduction.
    //   hideSourceMaps: don't ship maps to the browser (keep for upload).
    //   bundleSizeOptimizations: tree-shakes debug logging + drops dev-only
    //     Sentry features for ~5–10kB savings (replaces deprecated
    //     `disableLogger` option in @sentry/nextjs ≥ 10).
    //   tunnelRoute: routes Sentry envelopes through /monitoring on our
    //     own origin, dodging ad-blockers that nuke *.ingest.sentry.io —
    //     gives us full error visibility without an extra dropped-error tax.
    hideSourceMaps: true,
    bundleSizeOptimizations: {
      excludeDebugStatements: true,
    },
    tunnelRoute: '/monitoring',
  }),
);

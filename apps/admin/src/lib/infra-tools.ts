/**
 * "Hạ tầng" (Infrastructure) hub — single catalog of every 3rd-party tool the
 * admin wants to view from inside the admin app, without leaving for the
 * vendor's own dashboard.
 *
 * This is the ONE source of truth for the hub index grid (`/infra`) and the
 * per-tool pages. Each entry says:
 *   - slug         → route segment `/infra/<slug>` + worker `/admin/infra/<slug>`
 *   - name / blurb → card copy (vi-VN)
 *   - Icon         → lucide glyph
 *   - external     → "mở trang gốc ↗" deep-link to the vendor dashboard
 *   - built        → true once both a worker `case` + an `/infra/<slug>/page.tsx`
 *                    exist. `false` tools still show a card but their page says
 *                    "đang dựng".
 *
 * FOLLOW-UP AGENTS: flip `built: true` (and add the page + worker case) when you
 * ship a tool. Nothing else in the hub needs to change.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Triangle,
  Bug,
  Cloud,
  Mail,
  Database,
  LineChart,
  Github,
  Send,
  Network,
} from 'lucide-react';

export interface InfraTool {
  slug: string;
  name: string;
  /** Short vi-VN description of what this panel surfaces. */
  blurb: string;
  Icon: LucideIcon;
  /** Vendor's own dashboard (opens in a new tab). */
  external: string;
  /** Env var(s) the worker needs for this tool's detail endpoint. */
  env: string;
  /** True once the worker case + the /infra/<slug> page both exist. */
  built: boolean;
}

export const INFRA_TOOLS: InfraTool[] = [
  {
    slug: 'vercel',
    name: 'Vercel',
    blurb: 'Lần deploy gần đây của web/admin (trạng thái, nhánh, commit).',
    Icon: Triangle,
    external: 'https://vercel.com/nguyenhieuisocial-4628s-projects',
    env: 'ADMIN_VERCEL_TOKEN',
    built: true,
  },
  {
    slug: 'sentry',
    name: 'Sentry',
    blurb: 'Lỗi chưa xử lý gần đây (số lần, số người dùng, mức độ).',
    Icon: Bug,
    external: 'https://sentry.io/organizations/hieuasia/issues/',
    env: 'SENTRY_API_TOKEN',
    built: true,
  },
  {
    slug: 'resend',
    name: 'Resend',
    blurb: 'Email gửi gần đây (người nhận, tiêu đề, trạng thái giao).',
    Icon: Mail,
    external: 'https://resend.com/emails',
    env: 'RESEND_API_KEY',
    built: true,
  },
  {
    slug: 'cloudflare',
    name: 'Cloudflare',
    blurb: 'Worker invocations, WAF, analytics engine.',
    Icon: Cloud,
    external: 'https://dash.cloudflare.com/',
    env: 'CF_ANALYTICS_TOKEN / CLOUDFLARE_API_TOKEN',
    built: false,
  },
  {
    slug: 'supabase',
    name: 'Supabase',
    blurb: 'Postgres, auth users, edge functions.',
    Icon: Database,
    external: 'https://supabase.com/dashboard/project/_',
    env: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY',
    built: false,
  },
  {
    slug: 'langfuse',
    name: 'Langfuse',
    blurb: 'Traces LLM gần đây (độ trễ, chi phí, observations).',
    Icon: LineChart,
    external: 'https://cloud.langfuse.com',
    env: 'LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY',
    built: false,
  },
  {
    slug: 'github',
    name: 'GitHub',
    blurb: 'Dependabot alerts, PR, Actions.',
    Icon: Github,
    external: 'https://github.com/nguyenhieuisocial',
    env: 'GITHUB_TOKEN',
    built: false,
  },
  {
    slug: 'telegram',
    name: 'Telegram',
    blurb: '3 bot (public / notify / admin), webhook, topics.',
    Icon: Send,
    external: 'https://t.me/ad_hieuasia_bot',
    env: 'TELEGRAM_* tokens',
    built: false,
  },
  {
    slug: 'ai-gateway',
    name: 'AI Gateway',
    blurb: 'Định tuyến LLM qua Vercel AI Gateway (chi phí, provider).',
    Icon: Network,
    external: 'https://vercel.com/nguyenhieuisocial-4628s-projects/~/ai',
    env: 'AI_GATEWAY_API_KEY',
    built: false,
  },
];

export function getInfraTool(slug: string): InfraTool | undefined {
  return INFRA_TOOLS.find((t) => t.slug === slug);
}

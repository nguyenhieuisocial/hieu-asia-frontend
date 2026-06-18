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
  KeyRound,
  Activity,
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
    name: 'Cloudflare Worker',
    blurb: 'Lượt gọi Worker theo ngày (số request, lỗi, tỷ lệ lỗi 24h).',
    Icon: Cloud,
    external: 'https://dash.cloudflare.com/',
    env: 'CF_ANALYTICS_TOKEN / CLOUDFLARE_API_TOKEN',
    built: true,
  },
  {
    slug: 'kv',
    name: 'Cloudflare KV',
    blurb: 'Duyệt dữ liệu vận hành (phiên/đơn/streak/CTV) lưu trong KV.',
    Icon: KeyRound,
    external: 'https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces',
    env: 'KV bindings (SESSIONS / CACHE / AFFILIATES)',
    built: true,
  },
  {
    slug: 'supabase',
    name: 'Supabase',
    blurb: 'Các bảng Postgres theo số dòng (rows).',
    Icon: Database,
    external: 'https://supabase.com/dashboard/project/_',
    env: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY',
    built: true,
  },
  {
    slug: 'langfuse',
    name: 'Langfuse',
    blurb: 'Traces LLM gần đây (độ trễ, chi phí, người dùng).',
    Icon: LineChart,
    external: 'https://cloud.langfuse.com',
    env: 'LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY',
    built: true,
  },
  {
    slug: 'github',
    name: 'GitHub Actions',
    blurb: 'Lần chạy workflow gần đây (trạng thái, nhánh, người chạy).',
    Icon: Github,
    external: 'https://github.com/nguyenhieuisocial',
    env: 'GITHUB_TOKEN',
    built: true,
  },
  {
    slug: 'telegram',
    name: 'Telegram',
    blurb: '3 bot (public / notify / admin), webhook, hàng đợi cập nhật.',
    Icon: Send,
    external: 'https://t.me/ad_hieuasia_bot',
    env: 'TELEGRAM_* tokens',
    built: true,
  },
  {
    slug: 'ai-gateway',
    name: 'AI Gateway',
    blurb: 'Định tuyến LLM qua Vercel AI Gateway (chi phí, provider, lỗi).',
    Icon: Network,
    external: 'https://vercel.com/nguyenhieuisocial-4628s-projects/~/ai',
    env: 'AI_GATEWAY_API_KEY',
    built: true,
  },
  {
    slug: 'uptime',
    name: 'Uptime',
    blurb: 'Giám sát uptime + sự cố (BetterStack).',
    Icon: Activity,
    external: 'https://uptime.betterstack.com/',
    env: 'BETTERSTACK_API_TOKEN',
    built: true,
  },
];

export function getInfraTool(slug: string): InfraTool | undefined {
  return INFRA_TOOLS.find((t) => t.slug === slug);
}

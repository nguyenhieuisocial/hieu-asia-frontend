'use client';

/**
 * Hạ tầng → catch-all placeholder for tools that aren't built yet.
 *
 * Static segments `/infra/vercel`, `/infra/sentry`, `/infra/resend` take
 * precedence over this dynamic `[tool]` route, so this only renders for the
 * not-yet-built tools in `INFRA_TOOLS` (cloudflare, supabase, langfuse, github,
 * telegram, ai-gateway). A follow-up agent ships each by adding a static
 * `/infra/<slug>/page.tsx` (copy of vercel/page.tsx) + a worker `case`.
 *
 * Unknown slugs (not in the catalog) → notFound().
 */

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@hieu-asia/ui';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { getInfraTool } from '@/lib/infra-tools';

export default function InfraToolPlaceholderPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: slug } = use(params);
  const tool = getInfraTool(slug);
  if (!tool) notFound();

  const { Icon } = tool;

  return (
    <div className="space-y-6">
      <Link
        href="/infra"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Hạ tầng
      </Link>

      <PageHeader
        icon={<Icon className="h-5 w-5" />}
        title={tool.name}
        description={tool.blurb}
        actions={
          <a href={tool.external} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Mở trang gốc
            </Button>
          </a>
        }
      />

      <EmptyState
        title="Đang dựng"
        description={
          <>
            Bảng xem <span className="font-medium text-foreground">{tool.name}</span> ngay
            trong admin sẽ sớm có. Trong lúc chờ, bạn có thể{' '}
            <a
              href={tool.external}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              mở trang gốc ↗
            </a>
            .
          </>
        }
      />
    </div>
  );
}

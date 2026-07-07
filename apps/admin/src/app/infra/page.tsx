'use client';

/**
 * "Hạ tầng" (Infrastructure) hub — index grid.
 *
 * One card per 3rd-party tool (from `INFRA_TOOLS`). Each card links to its
 * detail panel `/infra/<slug>` and offers a "mở trang gốc ↗" deep-link to the
 * vendor's own dashboard. Every tool has its own `/infra/<slug>` detail page.
 *
 * Goal: an operator can triage Vercel/Sentry/Resend/… from inside admin
 * without juggling 9 vendor logins.
 */

import Link from 'next/link';
import { Card, CardContent } from '@hieu-asia/ui';
import { ExternalLink, Server } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { INFRA_TOOLS } from '@/lib/infra-tools';

export default function InfraHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Server className="h-5 w-5" />}
        title="Hạ tầng"
        description="Xem dữ liệu của các công cụ bên thứ ba ngay trong admin — không cần đăng nhập từng nơi."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INFRA_TOOLS.map((tool) => {
          const { Icon } = tool;
          return (
            <Card
              key={tool.slug}
              className="group relative transition-colors hover:border-gold/40"
            >
              <CardContent className="flex h-full flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-md border border-gold/20 bg-gradient-to-br from-gold/15 to-gold/0 p-2 text-gold">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-heading text-base font-semibold text-foreground">
                        {tool.name}
                      </h3>
                    </div>
                  </div>
                  <a
                    href={tool.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold"
                    aria-label={`Mở trang gốc ${tool.name}`}
                  >
                    mở trang gốc
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <p className="flex-1 text-sm text-muted-foreground">{tool.blurb}</p>

                <Link
                  href={`/infra/${tool.slug}`}
                  className="text-sm font-medium text-gold hover:underline"
                >
                  Xem chi tiết →
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

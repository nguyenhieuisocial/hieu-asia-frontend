'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@hieu-asia/ui';
import {
  Eye,
  Brain,
  Heart,
  Compass,
  FileText,
  GraduationCap,
  Scale,
  ChevronRight,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import {
  formatDateOrEmpty,
  formatRelativeOrEmpty,
  isMissingDate,
} from '@/lib/format-date';

/** Canonical agent roles. Must match Worker KV keys. */
const ROLES = [
  'vision',
  'logic',
  'psychology',
  'alignment',
  'report',
  'mentor',
  'judge',
] as const;
type Role = (typeof ROLES)[number];

const ROLE_META: Record<Role, { label: string; tagline: string; Icon: LucideIcon }> = {
  vision: { label: 'Vision', tagline: 'Diễn giải biểu tượng & ý nghĩa lá bài', Icon: Eye },
  logic: { label: 'Logic', tagline: 'Phân tích nhân quả, ràng buộc, tradeoff', Icon: Brain },
  psychology: { label: 'Psychology', tagline: 'Cảm xúc, động lực, blind spots', Icon: Heart },
  alignment: { label: 'Alignment', tagline: 'So với giá trị & mục tiêu dài hạn', Icon: Compass },
  report: { label: 'Report', tagline: 'Tổng hợp báo cáo cuối cùng', Icon: FileText },
  mentor: { label: 'Mentor', tagline: 'Chat tiếp theo sau khi đọc xong', Icon: GraduationCap },
  judge: { label: 'Judge', tagline: 'Kiểm tra chất lượng & nhất quán', Icon: Scale },
};

export interface PromptSummary {
  role: Role;
  system: string;
  updated_at: string | null;
  updated_by: string | null;
  version: number;
  /** `true` if KV has an override; `false` if currently using built-in default. */
  is_custom: boolean;
}

interface ListResp {
  ok: boolean;
  prompts?: PromptSummary[];
  error?: string;
}

async function fetchPrompts(): Promise<PromptSummary[]> {
  const r = await fetch('/api/admin/prompts', { cache: 'no-store' });
  if (r.status === 404) return []; // Worker not deployed yet — render empty grid + hint
  const data: ListResp = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.prompts ?? [];
}

// Wave 52-C — Date formatters live in `@/lib/format-date` now so the
// "1970-01-01" leak fix (treat 0/null/"" as missing → "Chưa override")
// applies consistently across every admin page.
const fmtDate = (iso: string | null) => formatDateOrEmpty(iso, 'Chưa override');
const fmtRelative = (iso: string | null) => formatRelativeOrEmpty(iso);

export default function PromptsListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'prompts'],
    queryFn: fetchPrompts,
  });

  const byRole = React.useMemo(() => {
    const m = new Map<Role, PromptSummary>();
    for (const p of data ?? []) m.set(p.role, p);
    return m;
  }, [data]);

  const workerMissing = !isLoading && !error && (data?.length ?? 0) === 0;
  const customCount = (data ?? []).filter((p) => p.is_custom).length;
  const totalVersions = (data ?? []).reduce((s, p) => s + p.version, 0);
  const lastUpdate = (data ?? []).reduce<string | null>((acc, p) => {
    // Skip epoch / null / "" sentinels — they would otherwise resolve to
    // 1970-01-01 and either never beat real timestamps (silent miss) or,
    // in odd corner cases, get picked when all values are missing and
    // leak "08:00 1/1/70" into the KPI tile (Wave 52-C bug #4).
    if (isMissingDate(p.updated_at)) return acc;
    if (!acc) return p.updated_at;
    return new Date(p.updated_at as string) > new Date(acc) ? p.updated_at : acc;
  }, null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt Editor"
        description="Chỉnh system prompt cho 7 vai trò trong pipeline agent. Lưu vào KV để override default."
        icon={<Sparkles className="h-5 w-5" />}
        badge={
          customCount > 0 ? (
            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
              {customCount}/{ROLES.length} custom
            </span>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total roles"
          value={ROLES.length}
          icon={<Sparkles className="h-4 w-4" />}
          accent="gold"
          hint="agent pipeline"
        />
        <KpiCard
          label="Custom overrides"
          value={customCount}
          icon={<FileText className="h-4 w-4" />}
          accent="purple"
          hint={`${ROLES.length - customCount} default`}
        />
        <KpiCard
          label="Total versions"
          value={totalVersions || '—'}
          icon={<Scale className="h-4 w-4" />}
          accent="jade"
          hint="lifetime edits"
        />
        <KpiCard
          label="Cập nhật cuối"
          value={
            <span className="font-heading text-base">
              {lastUpdate ? fmtRelative(lastUpdate) : '—'}
            </span>
          }
          icon={<Brain className="h-4 w-4" />}
          accent="gold"
          hint={lastUpdate ? fmtDate(lastUpdate) : ''}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Không tải được danh sách prompt</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {workerMissing && (
        <Alert variant="warning">
          <AlertTitle>Worker endpoint chưa sẵn sàng</AlertTitle>
          <AlertDescription>
            <code className="font-mono text-xs">GET /admin/prompts</code> trả 404 hoặc empty. Sẽ
            hiển thị 7 thẻ rỗng — click để edit thử (PUT có thể fail cho đến khi Worker deploy).
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((role) => {
          const meta = ROLE_META[role];
          const p = byRole.get(role);
          return (
            <Link key={role} href={`/prompts/${role}`} className="group focus:outline-none">
              <Card className="h-full border-gold/15 transition-colors group-hover:border-gold/40 group-focus-visible:border-gold/60">
                <CardHeader className="flex flex-row items-start gap-3">
                  <div className="rounded-md border border-gold/25 bg-gold/10 p-2 text-gold">
                    <meta.Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base text-foreground">{meta.label}</CardTitle>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{meta.tagline}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {p?.is_custom ? (
                        <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                          custom
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          default
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        v{p?.version ?? 1}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    <div>
                      Cập nhật:{' '}
                      <span className="text-foreground/85" title={p?.updated_at ?? ''}>
                        {fmtDate(p?.updated_at ?? null)}
                      </span>
                      {!isMissingDate(p?.updated_at) && (
                        <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                          ({fmtRelative(p?.updated_at ?? null)})
                        </span>
                      )}
                    </div>
                    <div>
                      Bởi: <span className="text-foreground/85">{p?.updated_by ?? '—'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

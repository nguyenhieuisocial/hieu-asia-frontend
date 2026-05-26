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
  Search,
  Sparkles,
  X,
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

type FilterMode = 'all' | 'custom' | 'default';

export default function PromptsListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'prompts'],
    queryFn: fetchPrompts,
  });

  // Wave 60.71.T2.prompts polish — search + custom/default filter so the
  // 7-role grid scales when we add more agents (e.g. specialised
  // judges/critics). State is local; no URL sync because the grid is small.
  const [search, setSearch] = React.useState('');
  const [filterMode, setFilterMode] = React.useState<FilterMode>('all');

  const byRole = React.useMemo(() => {
    const m = new Map<Role, PromptSummary>();
    for (const p of data ?? []) m.set(p.role, p);
    return m;
  }, [data]);

  const visibleRoles = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return ROLES.filter((role) => {
      const meta = ROLE_META[role];
      const p = byRole.get(role);
      if (filterMode === 'custom' && !p?.is_custom) return false;
      if (filterMode === 'default' && p?.is_custom) return false;
      if (q) {
        const haystack = `${role} ${meta.label} ${meta.tagline}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search, filterMode, byRole]);

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    [],
  );
  const handleClearSearch = React.useCallback(() => setSearch(''), []);
  const handleFilterAll = React.useCallback(() => setFilterMode('all'), []);
  const handleFilterCustom = React.useCallback(() => setFilterMode('custom'), []);
  const handleFilterDefault = React.useCallback(() => setFilterMode('default'), []);

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

      {/* Search + filter chrome — Wave 60.71.T2.prompts polish. Small footprint
          on desktop, full-width on mobile so the input is easy to tap. */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Tìm role / mô tả…"
            className="h-9 w-full rounded-md border border-gold/20 bg-card/60 pl-8 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/60 focus:outline-none"
            aria-label="Tìm prompt theo tên hoặc mô tả"
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Xoá tìm kiếm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
        <FilterChip
          label="Tất cả"
          count={ROLES.length}
          active={filterMode === 'all'}
          onClick={handleFilterAll}
        />
        <FilterChip
          label="Custom"
          count={customCount}
          active={filterMode === 'custom'}
          onClick={handleFilterCustom}
        />
        <FilterChip
          label="Default"
          count={ROLES.length - customCount}
          active={filterMode === 'default'}
          onClick={handleFilterDefault}
        />
      </div>

      {visibleRoles.length === 0 && !isLoading && (
        <Alert variant="default">
          <AlertTitle>Không có prompt khớp bộ lọc</AlertTitle>
          <AlertDescription>
            Thử xóa từ khoá hoặc chuyển sang "Tất cả".
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleRoles.map((role) => {
          const meta = ROLE_META[role];
          const p = byRole.get(role);
          return (
            <Link key={role} href={`/prompts/${role}`} className="group focus:outline-none">
              <Card className="h-full border-gold/15 transition-all duration-300 ease-editorial group-hover:border-gold/40 group-hover:shadow-[0_8px_28px_-12px_rgba(184,146,61,0.18)] group-focus-visible:border-gold/60">
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

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

/**
 * Tiny pill toggle used for the All/Custom/Default filter. Extracted so
 * the click handler doesn't need an inline arrow fn (Wave 60.70 ESLint
 * rule). `onClick` already stable via parent useCallback.
 */
function FilterChip({ label, count, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/60 bg-gold/15 px-3 text-xs text-gold transition-all duration-300 ease-editorial'
          : 'inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-xs text-muted-foreground transition-all duration-300 ease-editorial hover:border-gold/40 hover:text-foreground'
      }
    >
      <span>{label}</span>
      <span className="rounded bg-card/80 px-1.5 py-0.5 font-mono text-[10px]">{count}</span>
    </button>
  );
}

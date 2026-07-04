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
  Bot,
  Compass,
  FileText,
  GraduationCap,
  Lightbulb,
  Scale,
  ChevronRight,
  Search,
  Sparkles,
  Puzzle,
  Gauge,
  Orbit,
  SlidersHorizontal,
  BookOpen,
  X,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { KpiCard } from '@/components/admin/kpi-card';
import { PipelineDiagram } from '@/components/prompts/PipelineDiagram';
import { WiringBadge, type PromptMeta } from '@/components/prompts/prompt-meta';
import {
  formatDateOrEmpty,
  formatRelativeOrEmpty,
  isMissingDate,
} from '@/lib/format-date';
import { PROMPT_ROLES as ROLES, type PromptRole } from '@/lib/prompt-roles';

// Canonical role list gom về @/lib/prompt-roles (một nguồn cho cả list + detail).
type Role = PromptRole;

// Nhãn/tagline/icon dự phòng cho từng role. `meta` từ worker (backend #351) là
// nguồn hiển thị chính; bảng này là fallback + icon cho lưới thẻ. 15 role: 9
// pipeline/standalone + 5 công cụ + Cẩm Nang (backend #353).
const ROLE_META: Record<Role, { label: string; tagline: string; Icon: LucideIcon }> = {
  vision: { label: 'Vision', tagline: 'Diễn giải biểu tượng & ý nghĩa lá bài', Icon: Eye },
  logic: { label: 'Logic', tagline: 'Phân tích nhân quả, ràng buộc, tradeoff', Icon: Brain },
  psychology: { label: 'Psychology', tagline: 'Cảm xúc, động lực, blind spots', Icon: Heart },
  alignment: { label: 'Alignment', tagline: 'So với giá trị & mục tiêu dài hạn', Icon: Compass },
  report: { label: 'Report', tagline: 'Tổng hợp báo cáo cuối cùng', Icon: FileText },
  mentor: { label: 'Mentor', tagline: 'Chat tiếp theo sau khi đọc xong', Icon: GraduationCap },
  judge: { label: 'Judge', tagline: 'Kiểm tra chất lượng & nhất quán', Icon: Scale },
  decisions: {
    label: 'Decisions',
    tagline: 'Cố vấn "Giả lập quyết định" (persona + quy tắc; schema JSON do code giữ)',
    Icon: Lightbulb,
  },
  ops_copilot: {
    label: 'Ops Copilot',
    tagline: 'Trợ lý vận hành admin — trả lời chủ từ số liệu hệ thống',
    Icon: Bot,
  },
  mbti: { label: 'MBTI', tagline: 'Đọc kết quả trắc nghiệm 16 loại (khung tự-phản-tỉnh)', Icon: Puzzle },
  disc: { label: 'DISC', tagline: 'Đọc phong cách hành vi 4 chiều', Icon: Gauge },
  enneagram: { label: 'Enneagram', tagline: 'Đọc 9 nhóm động cơ & nỗi sợ cốt lõi', Icon: Orbit },
  bigfive: { label: 'Big Five', tagline: 'Đọc 5 chiều tính cách (IPIP)', Icon: SlidersHorizontal },
  tarot: { label: 'Tarot', tagline: 'Gợi mở phản tư quanh câu hỏi (không tiên đoán)', Icon: Sparkles },
  life_manual: {
    label: 'Cẩm Nang Cuộc Đời',
    tagline: 'Báo cáo cao cấp đa lăng kính (~30 mục) — bản chuẩn nội dung',
    Icon: BookOpen,
  },
};

export interface PromptSummary {
  role: Role;
  system: string;
  updated_at: string | null;
  updated_by: string | null;
  version: number;
  /** `true` if KV has an override; `false` if currently using built-in default. */
  is_custom: boolean;
  /** Ý nghĩa & kết nối (backend #351). undefined nếu worker cũ chưa deploy. */
  meta?: PromptMeta;
}

/** Raw worker row — does NOT include `is_custom`; we derive it on the FE. */
interface RawPrompt {
  role: Role;
  system: string;
  updated_at: string | null;
  updated_by: string | null;
  version: number;
  /** Backend #351 — worker cũ chưa deploy thì thiếu field này. */
  meta?: PromptMeta;
}

interface ListResp {
  ok: boolean;
  prompts?: RawPrompt[];
  error?: string;
}

/**
 * The worker's GET /admin/prompts returns the raw StoredPrompt
 * ({ role, system, updated_at, updated_by, version }) with NO `is_custom`
 * field — defaults come back as { version: 0, updated_by: 'default' }, an
 * override as { version >= 1, updated_by: <admin> }. Derive is_custom here so
 * the filters/KPIs/badges work. (#12)
 */
function deriveIsCustom(p: RawPrompt): PromptSummary {
  return { ...p, is_custom: p.version > 0 || (p.updated_by ?? 'default') !== 'default' };
}

async function fetchPrompts(): Promise<PromptSummary[]> {
  const r = await fetch('/api/admin/prompts', { cache: 'no-store' });
  if (r.status === 404) return []; // Worker not deployed yet — render empty grid + hint
  const data: ListResp = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return (data.prompts ?? []).map(deriveIsCustom);
}

// Wave 52-C — Date formatters live in `@/lib/format-date` now so the
// "1970-01-01" leak fix (treat 0/null/"" as missing) applies consistently
// across every admin page. Fallback "Bản chuẩn hệ thống" (task #30): chưa có
// ngày cập nhật nghĩa là đang dùng bản chuẩn, chưa ai chỉnh.
const fmtDate = (iso: string | null) => formatDateOrEmpty(iso, 'Bản chuẩn hệ thống');
const fmtRelative = (iso: string | null) => formatRelativeOrEmpty(iso);

type FilterMode = 'all' | 'custom' | 'default';

export default function PromptsListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'prompts'],
    queryFn: fetchPrompts,
    staleTime: 60_000,
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
        const haystack =
          `${role} ${meta.label} ${meta.tagline} ${p?.meta?.label ?? ''} ${p?.meta?.summary ?? ''}`.toLowerCase();
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
        description={`Chỉnh system prompt cho ${ROLES.length} vai trò AI (pipeline đọc + mentor + judge + cố vấn quyết định + trợ lý vận hành). Lưu vào KV để ghi đè bản chuẩn hệ thống.`}
        icon={<Sparkles className="h-5 w-5" />}
        badge={
          customCount > 0 ? (
            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
              {customCount}/{ROLES.length} tùy chỉnh
            </span>
          ) : null
        }
      />

      {/* Sơ đồ mạng lưới prompt — vẽ tự động từ meta.group + meta.flowsTo;
          click node cuộn tới card role bên dưới. */}
      <PipelineDiagram prompts={data ?? []} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Tổng vai trò"
          value={ROLES.length}
          icon={<Sparkles className="h-4 w-4" />}
          accent="gold"
          hint="pipeline + ngoài pipeline"
        />
        <KpiCard
          label="Bản tùy chỉnh"
          value={customCount}
          icon={<FileText className="h-4 w-4" />}
          accent="purple"
          hint={`${ROLES.length - customCount} bản chuẩn hệ thống`}
        />
        <KpiCard
          label="Tổng phiên bản"
          value={totalVersions || '—'}
          icon={<Scale className="h-4 w-4" />}
          accent="jade"
          hint="tổng lần chỉnh sửa"
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
            hiển thị {ROLES.length} thẻ rỗng — click để edit thử (PUT có thể fail cho đến khi
            Worker deploy).
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
          label="Bản tùy chỉnh"
          count={customCount}
          active={filterMode === 'custom'}
          onClick={handleFilterCustom}
        />
        <FilterChip
          label="Bản chuẩn"
          count={ROLES.length - customCount}
          active={filterMode === 'default'}
          onClick={handleFilterDefault}
        />
      </div>

      {visibleRoles.length === 0 && !isLoading && (
        <EmptyState
          title="Không có prompt khớp bộ lọc"
          description='Thử xóa từ khoá hoặc chuyển sang "Tất cả".'
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleRoles.map((role) => {
          const meta = ROLE_META[role];
          const p = byRole.get(role);
          return (
            <Link
              key={role}
              id={`role-card-${role}`}
              href={`/prompts/${role}`}
              className="group scroll-mt-24 focus:outline-none"
            >
              <Card className="h-full border-gold/15 transition-all duration-300 ease-editorial group-hover:border-gold/40 group-hover:shadow-[0_8px_28px_-12px_rgba(184,146,61,0.18)] group-focus-visible:border-gold/60">
                <CardHeader className="flex flex-row items-start gap-3">
                  <div className="rounded-md border border-gold/25 bg-gold/10 p-2 text-gold">
                    <meta.Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base text-foreground">
                        {p?.meta?.label ?? meta.label}
                      </CardTitle>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p?.meta?.summary ?? meta.tagline}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Task #30 — version 0 = đang dùng bản chuẩn; v>=1 = bản tùy chỉnh. */}
                      {p?.is_custom ? (
                        <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] text-gold">
                          Bản tùy chỉnh v{p.version}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
                          Bản chuẩn hệ thống
                        </span>
                      )}
                      {p?.meta && <WiringBadge wiring={p.meta.wiring} note={p.meta.wiring_note} />}
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

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowUpRight, X, Cpu } from 'lucide-react';
import { PROMPT_ROLES } from '@/lib/prompt-roles';

/**
 * Banner ngữ cảnh vai trò (Tầng 2 — deep-link theo role giữa các trang).
 *
 * Hiện khi URL có `?role=<role>` hợp lệ. Cho biết trang đang được mở "theo vai
 * trò" nào (thường deep-link từ trang Vai trò 360 /prompts/[role]), kèm **số liệu
 * thật** của vai trò đó (model đang chạy · chi phí · độ trễ · lỗi · lượt — gom từ
 * /admin/ai/role-models), link về Vai trò 360 và nút bỏ lọc.
 *
 * Dùng chung cho /vendors, /ai-quality, /llm-spend. Best-effort: role-models lỗi
 * → vẫn hiện dòng vai trò + link (ẩn phần số). Trả null khi không có ?role= hoặc
 * role không hợp lệ. Bọc trong <Suspense> tại nơi dùng (useSearchParams).
 */

interface BannerRoleModel {
  role: string;
  model: string;
  vendor: string;
  calls: number;
  cost_usd?: number;
  avg_latency_ms?: number;
  error_rate_pct?: number;
}

async function fetchRoleModels(): Promise<BannerRoleModel[]> {
  const r = await fetch('/api/admin-proxy/admin/ai/role-models?days=90', { cache: 'no-store' });
  if (!r.ok) return [];
  const data: { ok?: boolean; roles?: BannerRoleModel[] } = await r.json();
  return data?.ok ? (data.roles ?? []) : [];
}

export function RoleContextBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const role = params.get('role');
  const valid = !!role && (PROMPT_ROLES as readonly string[]).includes(role);

  const { data: roles } = useQuery({
    queryKey: ['admin', 'role-models-banner'],
    queryFn: fetchRoleModels,
    staleTime: 60_000,
    enabled: valid,
  });

  const clearRole = React.useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete('role');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  if (!valid) return null;
  const rm = (roles ?? []).find((x) => x.role === role);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-xs">
      <span className="inline-flex items-center gap-1.5 text-sm">
        <Sparkles className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        <span className="text-foreground/90">
          Vai trò: <span className="font-medium text-gold">{role}</span>
        </span>
      </span>
      {rm && (
        <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Cpu className="h-3 w-3 shrink-0 text-gold/70" aria-hidden />
            <span className="font-mono text-foreground/85" title={`${rm.model} · ${rm.vendor}`}>
              {rm.model}
            </span>
          </span>
          {typeof rm.cost_usd === 'number' && <span>· ${rm.cost_usd.toFixed(4)}</span>}
          {typeof rm.avg_latency_ms === 'number' && rm.avg_latency_ms > 0 && (
            <span>· {rm.avg_latency_ms.toLocaleString('vi-VN')} ms</span>
          )}
          {typeof rm.error_rate_pct === 'number' && <span>· lỗi {rm.error_rate_pct}%</span>}
          <span>· {rm.calls.toLocaleString('vi-VN')} lượt</span>
        </span>
      )}
      <Link
        href={`/prompts/${role}`}
        className="inline-flex items-center gap-1 rounded border border-gold/30 bg-card/60 px-2 py-0.5 text-gold transition-colors hover:bg-gold/15"
      >
        Vai trò 360 <ArrowUpRight className="h-3 w-3" aria-hidden />
      </Link>
      <button
        type="button"
        onClick={clearRole}
        className="ml-auto inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-muted-foreground transition-colors hover:text-gold"
      >
        Bỏ lọc <X className="h-3 w-3" aria-hidden />
      </button>
    </div>
  );
}

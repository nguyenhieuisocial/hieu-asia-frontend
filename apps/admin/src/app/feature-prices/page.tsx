'use client';

/**
 * /admin/feature-prices — Set a VND price per feature/tool.
 *
 * - GET /api/admin/feature-prices  → list { slug, label, vnd }[]
 * - PUT /api/admin/feature-prices  → update { slug, vnd }
 *
 * 0 = free ("Miễn phí"). Edit per-row; save on button click or Enter.
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  toast,
} from '@hieu-asia/ui';
import { Tag } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';

interface FeaturePrice {
  slug: string;
  label: string;
  vnd: number;
}

interface FeaturePricesResponse {
  ok: boolean;
  items?: FeaturePrice[];
  error?: string;
}

async function fetchPrices(): Promise<FeaturePricesResponse> {
  const r = await fetch('/api/admin/feature-prices', { cache: 'no-store' });
  const text = await r.text();
  try {
    return JSON.parse(text) as FeaturePricesResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

async function updatePrice(input: { slug: string; vnd: number }): Promise<FeaturePrice> {
  const r = await fetch('/api/admin/feature-prices', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.item as FeaturePrice;
}

export default function FeaturePricesPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'feature-prices'],
    queryFn: fetchPrices,
    staleTime: 60_000,
  });

  const items = React.useMemo(() => data?.items ?? [], [data?.items]);
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  // Per-row local draft values (keyed by slug).
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});

  // Sync drafts when items load/change.
  React.useEffect(() => {
    setDrafts((prev) => {
      const next: Record<string, string> = { ...prev };
      for (const item of items) {
        if (!(item.slug in next)) {
          next[item.slug] = String(item.vnd);
        }
      }
      return next;
    });
  }, [items]);

  const saveMut = useMutation({
    mutationFn: updatePrice,
    onSuccess: (item) => {
      toast.success('Đã lưu', { description: `${item.label}: ${item.vnd === 0 ? 'Miễn phí' : item.vnd.toLocaleString('vi-VN') + 'đ'}` });
      qc.invalidateQueries({ queryKey: ['admin', 'feature-prices'] });
    },
    onError: (e) => toast.error('Lưu thất bại', { description: (e as Error).message }),
  });

  function handleSave(slug: string) {
    const raw = drafts[slug] ?? '0';
    const vnd = parseInt(raw, 10);
    if (isNaN(vnd) || vnd < 0 || !Number.isInteger(vnd)) {
      toast.error('Giá không hợp lệ', { description: 'Phải là số nguyên ≥ 0.' });
      return;
    }
    saveMut.mutate({ slug, vnd });
  }

  function handleKeyDown(e: React.KeyboardEvent, slug: string) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(slug);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giá tính năng"
        description={
          <>
            Đặt giá cho từng công cụ. <strong>0đ = miễn phí</strong>. Đơn vị: VND.
          </>
        }
        icon={<Tag className="h-5 w-5" />}
        badge={
          items.length > 0 ? (
            <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[10px] text-gold">
              {items.length} công cụ
            </span>
          ) : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh sách công cụ</CardTitle>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được danh sách giá.'}
                onRetry={() => qc.invalidateQueries({ queryKey: ['admin', 'feature-prices'] })}
              />
            </div>
          )}

          {isLoading && (
            <div className="space-y-2 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted/30" />
              ))}
            </div>
          )}

          {!isLoading && items.length === 0 && !showError && (
            <EmptyState
              title="Chưa có dữ liệu giá"
              description="Backend chưa trả về danh sách công cụ."
              className="my-2 border-0 bg-transparent"
            />
          )}

          {items.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gold/15 bg-card/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-[11px] uppercase tracking-wider text-gold/80">
                    <th className="px-3 py-2 font-medium">Tính năng</th>
                    <th className="px-3 py-2 font-medium">Slug</th>
                    <th className="px-3 py-2 font-medium">Giá (VND)</th>
                    <th className="px-3 py-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const draft = drafts[item.slug] ?? String(item.vnd);
                    const parsedDraft = parseInt(draft, 10);
                    const isDirty = !isNaN(parsedDraft) && parsedDraft !== item.vnd;
                    return (
                      <tr
                        key={item.slug}
                        className="border-b border-gold/10 transition-all duration-300 ease-editorial last:border-0 hover:bg-gold/[0.03]"
                      >
                        <td className="px-3 py-2 font-medium text-foreground/90">{item.label}</td>
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{item.slug}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              value={draft}
                              onChange={(e) =>
                                setDrafts((prev) => ({ ...prev, [item.slug]: e.target.value }))
                              }
                              onKeyDown={(e) => handleKeyDown(e, item.slug)}
                              className="w-32 font-mono tabular-nums"
                              aria-label={`Giá cho ${item.label}`}
                            />
                            {draft === '0' || parsedDraft === 0 ? (
                              <span className="text-xs text-muted-foreground">Miễn phí</span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Button
                            size="sm"
                            variant={isDirty ? 'default' : 'outline'}
                            disabled={saveMut.isPending}
                            onClick={() => handleSave(item.slug)}
                          >
                            Lưu
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

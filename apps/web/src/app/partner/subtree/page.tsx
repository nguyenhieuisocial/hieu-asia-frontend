'use client';

/**
 * /partner/subtree — paginated list of the partner's downline.
 *
 * Wave 44. RLS scopes the query to subtree. Filters: depth_relative + status.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton, StatusBadge, Input } from '@hieu-asia/ui';
import { PartnerShell, partnerFetch } from '@/components/partner/PartnerShell';

interface SubtreeRow {
  user_id: string;
  affiliate_code: string;
  email_masked: string | null;
  depth: number;
  depth_relative: number;
  tier: string;
  status: string;
  created_at: string;
}

interface SubtreeResp {
  ok: true;
  descendants: SubtreeRow[];
  total: number;
}

function dt(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short' });
  } catch {
    return iso;
  }
}

function statusTone(s: string): 'success' | 'warning' | 'error' | 'neutral' {
  if (s === 'active') return 'success';
  if (s === 'banned') return 'error';
  if (s === 'suspended') return 'warning';
  return 'neutral';
}

export default function PartnerSubtreePage() {
  return <PartnerShell>{() => <SubtreeView />}</PartnerShell>;
}

function SubtreeView() {
  const [data, setData] = React.useState<SubtreeResp | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [depthFilter, setDepthFilter] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    async function load() {
      try {
        const qs = new URLSearchParams();
        if (depthFilter) qs.set('depth', depthFilter);
        if (statusFilter) qs.set('status', statusFilter);
        const url = `/api/partner/subtree${qs.toString() ? `?${qs}` : ''}`;
        const r = await partnerFetch<SubtreeResp>(url);
        if (!cancelled) setData(r);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [depthFilter, statusFilter]);

  const filtered = React.useMemo(() => {
    if (!data) return [];
    const s = search.trim().toLowerCase();
    if (!s) return data.descendants;
    return data.descendants.filter(
      (r) =>
        r.affiliate_code.toLowerCase().includes(s) ||
        (r.email_masked ? r.email_masked.toLowerCase().includes(s) : false),
    );
  }, [data, search]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mạng lưới của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input
              placeholder="Tìm theo mã hoặc email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <select
              value={depthFilter}
              onChange={(e) => setDepthFilter(e.target.value)}
              className="h-9 rounded-md border border-foreground/15 bg-background px-3 text-sm"
            >
              <option value="">Tất cả tầng (từ self)</option>
              <option value="1">Tầng 1 (direct)</option>
              <option value="2">Tầng 2</option>
              <option value="3">Tầng 3</option>
              <option value="4">Tầng 4+</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-foreground/15 bg-background px-3 text-sm"
            >
              <option value="">Mọi trạng thái</option>
              <option value="active">active</option>
              <option value="banned">banned</option>
              <option value="suspended">suspended</option>
            </select>
            {data ? (
              <span className="text-xs text-foreground/60">
                {filtered.length}/{data.total} người
              </span>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-red-500">Lỗi: {error}</p>
          ) : !data ? (
            <Skeleton className="h-64 w-full" />
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/70">
              Chưa có ai trong mạng lưới với bộ lọc này.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-foreground/10 text-left text-xs uppercase tracking-wider text-foreground/60">
                  <tr>
                    <th className="py-2 pr-3">Mã</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Tầng (từ bạn)</th>
                    <th className="py-2 pr-3">Tier</th>
                    <th className="py-2 pr-3">Trạng thái</th>
                    <th className="py-2 pr-3">Ngày tham gia</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.user_id} className="border-b border-foreground/5">
                      <td className="py-2 pr-3 font-mono text-xs">{r.affiliate_code}</td>
                      <td className="py-2 pr-3 text-foreground/80">
                        {r.email_masked ?? '—'}
                      </td>
                      <td className="py-2 pr-3">{r.depth_relative}</td>
                      <td className="py-2 pr-3 text-foreground/80">{r.tier}</td>
                      <td className="py-2 pr-3">
                        <StatusBadge status={statusTone(r.status)} label={r.status} />
                      </td>
                      <td className="py-2 pr-3 text-foreground/70">{dt(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

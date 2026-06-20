'use client';

/**
 * FeedbackCharts — insight charts for /feedback, derived 100% from the rows the
 * page already fetched via GET /admin/feedback?limit=100. NO extra network call:
 * everything here is client-side group-by over the in-memory list, so the charts
 * can never disagree with the table above them.
 *
 * Pre-launch honesty: every chart renders a muted "chưa có dữ liệu" state when
 * the slice it needs is empty, and each card labels its source + window. We never
 * fabricate a bar — a quiet product shows quiet (but truthful) charts.
 *
 * Style: matches the analytics/*Chart.tsx recharts conventions (gold grid, dark
 * tooltip, brand color tokens) and reuses the shared SVG DonutChart for
 * categorical breakdowns.
 */

import * as React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, colors } from '@hieu-asia/ui';
import { DonutChart, type DonutSlice } from '@/components/admin/donut-chart';

const GOLD = colors.gold.DEFAULT;
const JADE = colors.jade.DEFAULT;
const PURPLE = colors.purple.DEFAULT;

type FeedbackStatus = 'new' | 'triaged' | 'resolved';
type FeedbackSurface = 'reading' | 'pricing' | 'onboarding' | 'misc';

export interface FeedbackRow {
  ts: string;
  surface: FeedbackSurface;
  rating: number | null;
  status: FeedbackStatus;
}

const SURFACE_LABEL: Record<FeedbackSurface, string> = {
  reading: 'Báo cáo',
  pricing: 'Giá / CTA',
  onboarding: 'Onboarding',
  misc: 'Khác',
};

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  new: 'Mới',
  triaged: 'Đang xử lý',
  resolved: 'Đã xử lý',
};

const VOLUME_WINDOW_DAYS = 14;

/** Local YYYY-MM-DD key (vi-VN is UTC+7; using local date avoids off-by-one). */
function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Empty placeholder shared by all charts so sparse data reads honestly. */
function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-gold/15 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

/** Last-N-days feedback volume (count per day), zero-filled so gaps show as 0. */
function VolumeChart({ rows }: { rows: FeedbackRow[] }) {
  const data = React.useMemo(() => {
    const counts = new Map<string, number>();
    const today = new Date();
    const buckets: { key: string; label: string }[] = [];
    for (let i = VOLUME_WINDOW_DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = dayKey(d);
      counts.set(key, 0);
      buckets.push({ key, label: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` });
    }
    for (const r of rows) {
      const t = new Date(r.ts);
      if (Number.isNaN(t.getTime())) continue;
      const key = dayKey(t);
      if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return buckets.map((b) => ({ label: b.label, count: counts.get(b.key) ?? 0 }));
  }, [rows]);

  const hasAny = data.some((d) => d.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lượng phản hồi theo ngày</CardTitle>
        <CardDescription>
          {VOLUME_WINDOW_DAYS} ngày gần nhất · nguồn: danh sách phản hồi đang tải.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasAny ? (
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="rgba(242,237,227,0.5)"
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,15,18,0.95)',
                    border: '1px solid rgba(184,146,61,0.3)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: GOLD }}
                  formatter={(value: unknown) => {
                    const n = typeof value === 'number' ? value : Number(value);
                    return [n.toLocaleString('vi-VN'), 'Phản hồi'];
                  }}
                />
                <Bar dataKey="count" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState>Chưa có phản hồi nào trong {VOLUME_WINDOW_DAYS} ngày qua.</EmptyState>
        )}
      </CardContent>
    </Card>
  );
}

/** Rating histogram 1★–5★ over feedback that actually carried a rating. */
function RatingChart({ rows }: { rows: FeedbackRow[] }) {
  const rated = rows.filter((r) => r.rating != null);
  const data = React.useMemo(() => {
    const buckets = [1, 2, 3, 4, 5].map((star) => ({
      star,
      label: `${star}★`,
      count: rated.filter((r) => Math.round(r.rating as number) === star).length,
    }));
    return buckets;
  }, [rated]);

  // 1–2★ = warm red (cảnh báo), 3★ = gold, 4–5★ = jade (tích cực).
  const barColor = (star: number) => (star <= 2 ? '#C2410C' : star === 3 ? GOLD : JADE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân bố đánh giá</CardTitle>
        <CardDescription>
          {rated.length} phản hồi có chấm sao · nguồn: danh sách phản hồi đang tải.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rated.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(184,146,61,0.1)" />
                <XAxis dataKey="label" stroke="rgba(242,237,227,0.5)" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="rgba(242,237,227,0.5)"
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,15,18,0.95)',
                    border: '1px solid rgba(184,146,61,0.3)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: GOLD }}
                  formatter={(value: unknown) => {
                    const n = typeof value === 'number' ? value : Number(value);
                    return [n.toLocaleString('vi-VN'), 'Phản hồi'];
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((d) => (
                    <Cell key={d.star} fill={barColor(d.star)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState>Chưa có phản hồi nào kèm đánh giá sao.</EmptyState>
        )}
      </CardContent>
    </Card>
  );
}

/** Surface + status breakdown side by side, using the shared SVG donut. */
function BreakdownCharts({ rows }: { rows: FeedbackRow[] }) {
  const surfaceSlices: DonutSlice[] = React.useMemo(() => {
    const order: FeedbackSurface[] = ['reading', 'pricing', 'onboarding', 'misc'];
    const palette = [GOLD, JADE, PURPLE, colors.gold[300]];
    return order
      .map((s, i) => ({
        label: SURFACE_LABEL[s],
        value: rows.filter((r) => r.surface === s).length,
        color: palette[i] ?? GOLD,
      }))
      .filter((slice) => slice.value > 0);
  }, [rows]);

  const statusSlices: DonutSlice[] = React.useMemo(() => {
    const order: FeedbackStatus[] = ['new', 'triaged', 'resolved'];
    const palette = [GOLD, '#C2410C', JADE];
    return order
      .map((s, i) => ({
        label: STATUS_LABEL[s],
        value: rows.filter((r) => r.status === s).length,
        color: palette[i] ?? GOLD,
      }))
      .filter((slice) => slice.value > 0);
  }, [rows]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Phản hồi đến từ đâu</CardTitle>
          <CardDescription>
            Theo nơi gửi · nguồn: danh sách phản hồi đang tải.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length > 0 ? (
            <DonutChart
              slices={surfaceSlices}
              centerLabel={
                <div className="leading-tight">
                  <div className="font-mono text-lg text-foreground">{rows.length}</div>
                  <div className="text-[10px] text-muted-foreground">phản hồi</div>
                </div>
              }
            />
          ) : (
            <EmptyState>Chưa có phản hồi nào.</EmptyState>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trạng thái xử lý</CardTitle>
          <CardDescription>
            new · triaged · resolved · nguồn: danh sách phản hồi đang tải.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length > 0 ? (
            <DonutChart
              slices={statusSlices}
              centerLabel={
                <div className="leading-tight">
                  <div className="font-mono text-lg text-foreground">{rows.length}</div>
                  <div className="text-[10px] text-muted-foreground">tổng</div>
                </div>
              }
            />
          ) : (
            <EmptyState>Chưa có phản hồi nào.</EmptyState>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function FeedbackCharts({ rows }: { rows: FeedbackRow[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <VolumeChart rows={rows} />
        <RatingChart rows={rows} />
      </div>
      <BreakdownCharts rows={rows} />
    </div>
  );
}

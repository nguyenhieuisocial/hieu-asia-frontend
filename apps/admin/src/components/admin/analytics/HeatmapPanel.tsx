'use client';

/**
 * HeatmapPanel — in-admin click/scroll heatmap.
 *
 * Pulls density data for a URL from PostHog server-side (GET
 * /api/admin/posthog/heatmap — key never leaks, no public link) and renders it
 * as a heat overlay on a canvas. Coordinate-based (no live page behind it),
 * which keeps it secure and cross-origin-safe; it still shows WHERE on the page
 * clicks/scroll concentrate, by viewport width.
 */

import * as React from 'react';
import { Button, Card, CardContent, Input } from '@hieu-asia/ui';
import { Flame, Play } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';

interface HeatmapPoint {
  x: number; // 0..1 relative
  y: number; // absolute px
  count: number;
  fixed: boolean;
}
interface HeatmapResponse {
  ok: boolean;
  points: HeatmapPoint[];
  error?: string;
}

const TYPES = [
  { value: 'click', label: 'Click' },
  { value: 'rageclick', label: 'Rage-click (bực)' },
  { value: 'mousemove', label: 'Di chuột' },
  { value: 'scrolldepth', label: 'Độ cuộn' },
] as const;

const WIDTH = 1024; // canvas render width (relative-x is scaled to this)

export default function HeatmapPanel() {
  const [url, setUrl] = React.useState('https://hieu.asia/');
  const [type, setType] = React.useState<string>('click');
  const [data, setData] = React.useState<HeatmapResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const run = React.useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const qs = new URLSearchParams({ url: url.trim(), type, dateFrom: '-30d' });
      const res = await fetch(`/api/admin/posthog/heatmap?${qs.toString()}`);
      const json = (await res.json().catch(() => ({
        ok: false,
        points: [],
        error: `HTTP ${res.status}`,
      }))) as HeatmapResponse;
      setData(json);
    } catch (e) {
      setData({ ok: false, points: [], error: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, [url, type]);

  // Paint the heat overlay whenever data changes.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.ok || data.points.length === 0) return;
    const maxY = Math.max(...data.points.map((p) => p.y), 400);
    const maxCount = Math.max(...data.points.map((p) => p.count), 1);
    const height = Math.min(maxY + 60, 6000);
    canvas.width = WIDTH;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, WIDTH, height);
    ctx.fillStyle = '#1a1814';
    ctx.fillRect(0, 0, WIDTH, height);
    for (const p of data.points) {
      const cx = p.x * WIDTH;
      const cy = p.y;
      const intensity = p.count / maxCount; // 0..1
      const r = 14 + intensity * 26;
      const hue = 240 - intensity * 240; // blue(low) → red(high)
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `hsla(${hue}, 90%, 55%, ${0.28 + intensity * 0.5})`);
      grad.addColorStop(1, `hsla(${hue}, 90%, 55%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [data]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bản đồ nhiệt"
        description="Xem khách click / cuộn nhiều ở đâu trên một trang — lấy số liệu từ PostHog ngay trong admin, không qua trang họ, không lộ ra ngoài."
        icon={<Flame className="h-5 w-5" />}
      />

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-[16rem] flex-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              URL trang
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://hieu.asia/"
              className="mt-1"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Loại
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block h-10 rounded-md border border-border bg-card/60 px-3 text-sm text-foreground outline-none focus:border-gold/50"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <Button size="sm" onClick={() => void run()} disabled={loading || !url.trim()}>
            <Play className="mr-1.5 h-3.5 w-3.5" />
            {loading ? 'Đang tải…' : 'Xem'}
          </Button>
        </CardContent>
      </Card>

      {loading && <div className="h-64 animate-pulse rounded bg-muted/30" />}

      {data && !data.ok && <ErrorBlock compact message={data.error ?? 'Không tải được bản đồ nhiệt.'} />}

      {data?.ok && data.points.length === 0 && (
        <EmptyState
          title="Chưa có dữ liệu cho trang này"
          description="Chưa có click/cuộn nào được ghi cho URL này trong 30 ngày (hệ thống đang ít traffic). Thử URL khác hoặc quay lại khi có khách."
          className="border-0 bg-transparent"
        />
      )}

      {data?.ok && data.points.length > 0 && (
        <Card>
          <CardContent className="space-y-2 p-3">
            <p className="font-mono text-[11px] text-muted-foreground">
              {data.points.length} điểm · đỏ = nhiều, xanh = ít · bề rộng quy ước {WIDTH}px
            </p>
            <div className="overflow-auto rounded-md border border-border">
              <canvas ref={canvasRef} className="block max-w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

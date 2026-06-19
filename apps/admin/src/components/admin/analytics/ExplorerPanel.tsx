'use client';

/**
 * ExplorerPanel — in-admin HogQL Query Explorer.
 *
 * Lets the founder ask any question of the PostHog data WITHOUT leaving admin
 * and WITHOUT a public share link. Ready-made queries (one click) cover the
 * common questions for a non-technical user; an advanced box runs arbitrary
 * read-only HogQL. Everything goes through POST /api/admin/posthog/query, which
 * runs server-side (key never leaks) and is read-only guarded + row-capped.
 */

import * as React from 'react';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { Play, Database, Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';

interface Preset {
  label: string;
  sql: string;
}

// Ready-made questions — the founder clicks one, no HogQL needed.
const PRESETS: Preset[] = [
  {
    label: 'Sự kiện 24h gần nhất',
    sql: "SELECT toStartOfHour(timestamp) AS gio, count() AS so_su_kien\nFROM events\nWHERE timestamp > now() - INTERVAL 24 HOUR\nGROUP BY gio ORDER BY gio",
  },
  {
    label: 'Người dùng theo ngày (14 ngày)',
    sql: "SELECT toDate(timestamp) AS ngay, count(DISTINCT person_id) AS nguoi_dung\nFROM events\nWHERE timestamp > now() - INTERVAL 14 DAY\nGROUP BY ngay ORDER BY ngay",
  },
  {
    label: 'Top 15 trang xem nhiều (7 ngày)',
    sql: "SELECT properties.$current_url AS trang, count() AS luot_xem\nFROM events\nWHERE event = '$pageview' AND timestamp > now() - INTERVAL 7 DAY\nGROUP BY trang ORDER BY luot_xem DESC LIMIT 15",
  },
  {
    label: 'Top công cụ dùng nhiều (30 ngày)',
    sql: "SELECT properties.tool AS cong_cu, count() AS luot, count(DISTINCT person_id) AS nguoi\nFROM events\nWHERE event = 'tool_used' AND timestamp > now() - INTERVAL 30 DAY\nGROUP BY cong_cu ORDER BY luot DESC LIMIT 20",
  },
  {
    label: 'Nguồn traffic (UTM source, 30 ngày)',
    sql: "SELECT coalesce(nullIf(properties.$initial_utm_source, ''), properties.$initial_referring_domain, 'trực tiếp') AS nguon, count(DISTINCT person_id) AS nguoi\nFROM events\nWHERE timestamp > now() - INTERVAL 30 DAY\nGROUP BY nguon ORDER BY nguoi DESC LIMIT 20",
  },
  {
    label: '50 sự kiện gần nhất',
    sql: "SELECT timestamp, event, properties.$current_url AS trang, distinct_id\nFROM events ORDER BY timestamp DESC LIMIT 50",
  },
];

interface QueryResult {
  ok: boolean;
  columns: string[];
  rows: unknown[][];
  error?: string;
  truncated?: boolean;
}

function cellText(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

export default function ExplorerPanel() {
  const [sql, setSql] = React.useState<string>(PRESETS[0]?.sql ?? '');
  const [result, setResult] = React.useState<QueryResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  const run = React.useCallback(async (query: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/posthog/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = (await res.json().catch(() => ({
        ok: false,
        columns: [],
        rows: [],
        error: `HTTP ${res.status}`,
      }))) as QueryResult;
      setResult(data);
    } catch (e) {
      setResult({ ok: false, columns: [], rows: [], error: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, []);

  function exportCsv() {
    if (!result?.ok || result.rows.length === 0) return;
    const cols = result.columns;
    const objs = result.rows.map((row) =>
      Object.fromEntries(cols.map((c, i) => [c, cellText(row[i])])),
    );
    const headers = Object.fromEntries(cols.map((c) => [c, c]));
    exportToCSV(objs, fmtCsvFilename('posthog-query'), headers);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bảng hỏi dữ liệu"
        description="Hỏi bất kỳ điều gì về dữ liệu — chạy ngay trong admin, không qua trang PostHog, không lộ ra ngoài. Bấm một mẫu có sẵn hoặc tự viết câu hỏi (HogQL)."
        icon={<Database className="h-5 w-5" />}
      />

      {/* Ready-made questions */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setSql(p.sql);
              void run(p.sql);
            }}
            disabled={loading}
            className="rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-xs font-medium text-foreground/85 transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Advanced editor */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Câu hỏi (HogQL — chỉ đọc)
          </label>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            spellCheck={false}
            rows={6}
            className="w-full resize-y rounded-md border border-border bg-card/60 p-3 font-mono text-xs text-foreground outline-none focus:border-gold/50"
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => void run(sql)} disabled={loading || !sql.trim()}>
              <Play className="mr-1.5 h-3.5 w-3.5" />
              {loading ? 'Đang chạy…' : 'Chạy'}
            </Button>
            {result?.ok && result.rows.length > 0 && (
              <Button size="sm" variant="outline" onClick={exportCsv}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Xuất CSV
              </Button>
            )}
            {result?.ok && (
              <span className="font-mono text-[11px] text-muted-foreground">
                {result.rows.length} dòng{result.truncated ? ' (đã cắt ở 1000)' : ''}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded bg-muted/30" />
          ))}
        </div>
      )}

      {result && !result.ok && (
        <ErrorBlock compact message={result.error ?? 'Truy vấn thất bại.'} />
      )}

      {result?.ok && result.rows.length === 0 && (
        <EmptyState
          title="Không có dữ liệu"
          description="Câu hỏi chạy thành công nhưng chưa có dòng nào khớp (hệ thống đang ít dữ liệu)."
          className="border-0 bg-transparent"
        />
      )}

      {result?.ok && result.rows.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-gold/15 text-left font-mono text-[11px] uppercase tracking-wide text-gold/80">
                    {result.columns.map((c) => (
                      <th key={c} className="whitespace-nowrap px-3 py-2 font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-gold/10 last:border-0 hover:bg-gold/[0.03]">
                      {result.columns.map((_, ci) => (
                        <td
                          key={ci}
                          className="max-w-[28ch] truncate px-3 py-1.5 font-mono text-xs text-foreground/85"
                          title={cellText(row[ci])}
                        >
                          {cellText(row[ci])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

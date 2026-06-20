'use client';

/**
 * Cloudflare Worker detail panels for /infra/cloudflare — script metadata tile,
 * cron triggers, bindings inventory (secret NAMES only), routes, and per-panel
 * permission notes (when the token couldn't read a section).
 *
 * Each panel renders only when the worker sent that data (all props optional).
 */

import * as React from 'react';
import { Card, CardContent } from '@hieu-asia/ui';
import { AlertTriangle } from 'lucide-react';
import type {
  InfraCfScriptMeta,
  InfraCfCronTrigger,
  InfraCfBinding,
  InfraCfRoute,
} from '@/lib/admin-api';
import { formatRelativeOrEmpty } from '@/lib/format-date';

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="break-all text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

/** Worker script metadata tile. */
export function CfScriptMetaCard({ meta }: { meta: InfraCfScriptMeta }) {
  return (
    <Card>
      <CardContent className="p-4">
        <PanelLabel>Thông tin worker</PanelLabel>
        <div>
          <InfoRow label="Tạo lúc" value={formatRelativeOrEmpty(meta.created_on) || meta.created_on} />
          <InfoRow
            label="Sửa lúc"
            value={formatRelativeOrEmpty(meta.modified_on) || meta.modified_on}
          />
          <InfoRow label="Gói dùng" value={meta.usage_model} />
          <InfoRow
            label="Ngày tương thích"
            value={
              meta.compatibility_date ? (
                <span className="font-mono text-xs">{meta.compatibility_date}</span>
              ) : null
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

/** Cron triggers panel. */
export function CfCronCard({ crons }: { crons: InfraCfCronTrigger[] }) {
  if (crons.length === 0) return null;
  return (
    <Card>
      <CardContent className="p-4">
        <PanelLabel>Lịch chạy (Cron)</PanelLabel>
        <div className="space-y-1.5">
          {crons.map((c) => (
            <div
              key={c.cron}
              className="flex items-center justify-between gap-3 border-b border-border/40 py-1.5 last:border-0"
            >
              <code className="rounded bg-muted/40 px-2 py-0.5 font-mono text-xs text-foreground">
                {c.cron}
              </code>
              <span className="text-xs text-muted-foreground">
                {formatRelativeOrEmpty(c.modified_on) || '—'}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** Bindings inventory — KV/R2/D1/queues/services + secret NAMES (no values). */
export function CfBindingsCard({ bindings }: { bindings: InfraCfBinding[] }) {
  if (bindings.length === 0) return null;
  return (
    <Card>
      <CardContent className="p-4">
        <PanelLabel>Bindings & secret (chỉ tên)</PanelLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Tên</th>
                <th className="py-2 pr-4">Loại</th>
                <th className="py-2">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {bindings.map((b) => (
                <tr key={`${b.type}-${b.name}`} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4 font-mono text-xs">{b.name}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{b.type}</td>
                  <td className="break-all py-2 font-mono text-xs text-muted-foreground">
                    {b.detail ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

/** Routes panel — pattern list. */
export function CfRoutesCard({ routes }: { routes: InfraCfRoute[] }) {
  if (routes.length === 0) return null;
  return (
    <Card>
      <CardContent className="p-4">
        <PanelLabel>Routes</PanelLabel>
        <div className="space-y-1.5">
          {routes.map((r) => (
            <code
              key={r.id ?? r.pattern}
              className="block break-all rounded bg-muted/40 px-2 py-1 font-mono text-xs text-foreground"
            >
              {r.pattern}
            </code>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** Honest per-panel permission notes (token couldn't read a section). */
export function CfPermissionNotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <Card className="border-amber-400/40 bg-amber-500/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <p className="mb-1 text-sm font-medium text-foreground">
              Token thiếu một số quyền đọc
            </p>
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

/**
 * Vercel detail panels for /infra/vercel — project info card, production domains
 * table, and the env-var inventory (NAMES ONLY) grouped by environment.
 *
 * Each panel renders only when the worker sent that data (all props optional).
 * No env-var VALUES are ever fetched or shown — only names + metadata.
 */

import * as React from 'react';
import { Card, CardContent } from '@hieu-asia/ui';
import { ExternalLink } from 'lucide-react';
import type {
  InfraVercelProject,
  InfraVercelDomain,
  InfraVercelEnvGroup,
} from '@/lib/admin-api';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { InfraStatusPill } from '@/components/admin/infra/infra-panel';

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

/** Project info card — framework, node, build/install cmd, repo link, alias. */
export function VercelProjectCard({ project }: { project: InfraVercelProject }) {
  return (
    <Card>
      <CardContent className="p-4">
        <PanelLabel>Thông tin dự án</PanelLabel>
        <div>
          <InfoRow label="Tên" value={project.name} />
          <InfoRow label="Framework" value={project.framework} />
          <InfoRow label="Node" value={project.nodeVersion} />
          <InfoRow label="Thư mục gốc" value={project.rootDirectory} />
          <InfoRow
            label="Lệnh build"
            value={
              project.buildCommand ? (
                <span className="font-mono text-xs">{project.buildCommand}</span>
              ) : null
            }
          />
          <InfoRow
            label="Lệnh cài đặt"
            value={
              project.installCommand ? (
                <span className="font-mono text-xs">{project.installCommand}</span>
              ) : null
            }
          />
          <InfoRow label="Nhánh prod" value={project.productionBranch} />
          <InfoRow
            label="Repo"
            value={
              project.repo ? (
                <span className="font-mono text-xs">{project.repo}</span>
              ) : null
            }
          />
          <InfoRow
            label="Alias prod"
            value={
              project.prodAlias ? (
                <a
                  href={`https://${project.prodAlias}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-gold hover:underline"
                >
                  {project.prodAlias}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

/** Production domains table with verified / SSL / misconfigured pills. */
export function VercelDomainsCard({ domains }: { domains: InfraVercelDomain[] }) {
  if (domains.length === 0) return null;
  return (
    <Card>
      <CardContent className="p-4">
        <PanelLabel>Tên miền sản xuất</PanelLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Tên miền</th>
                <th className="py-2 pr-4">Xác minh</th>
                <th className="py-2">Cấu hình</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.name} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4">
                    <a
                      href={`https://${d.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gold hover:underline"
                    >
                      {d.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="py-2 pr-4">
                    <InfraStatusPill
                      label={d.verified ? 'đã xác minh' : 'chưa xác minh'}
                      tone={d.verified ? 'good' : 'warn'}
                    />
                  </td>
                  <td className="py-2">
                    {d.misconfigured == null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <InfraStatusPill
                        label={d.misconfigured ? 'sai cấu hình' : 'OK'}
                        tone={d.misconfigured ? 'bad' : 'good'}
                      />
                    )}
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

/**
 * Env-var inventory grouped by environment — NAMES ONLY. A per-group tab strip
 * lets the operator filter; values are never present.
 */
export function VercelEnvCard({ groups }: { groups: InfraVercelEnvGroup[] }) {
  const nonEmpty = groups.filter((g) => g.vars.length > 0);
  const [active, setActive] = React.useState(0);
  const current = nonEmpty[Math.min(active, nonEmpty.length - 1)];
  if (!current) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <PanelLabel>Biến môi trường (chỉ tên)</PanelLabel>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {nonEmpty.map((g, i) => (
            <button
              key={g.target}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                i === active
                  ? 'bg-gold/15 text-gold'
                  : 'text-muted-foreground hover:bg-muted/40'
              }`}
            >
              {g.target} ({g.vars.length})
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Tên</th>
                <th className="py-2 pr-4">Loại</th>
                <th className="py-2 pr-4">Nhánh</th>
                <th className="py-2">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {current.vars.map((v) => (
                <tr
                  key={`${v.key}-${v.gitBranch ?? ''}`}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2 pr-4 font-mono text-xs">{v.key}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{v.type ?? '—'}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{v.gitBranch ?? '—'}</td>
                  <td className="whitespace-nowrap py-2 text-muted-foreground">
                    {formatRelativeOrEmpty(
                      v.updatedAt != null ? new Date(v.updatedAt).toISOString() : null,
                    ) || '—'}
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

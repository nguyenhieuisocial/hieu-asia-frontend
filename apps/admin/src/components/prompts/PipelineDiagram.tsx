'use client';

import * as React from 'react';
import { ArrowRight, CornerDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import type { PromptMeta, PromptWiring } from './prompt-meta';

/**
 * Sơ đồ MẠNG LƯỚI kết nối các system prompt — vẽ TỰ ĐỘNG từ dữ liệu worker trả
 * (`meta.group` + `meta.flowsTo`, backend #355). Thêm role/công cụ mới ở backend
 * là sơ đồ tự cập nhật, không phải sửa tay ở đây nữa.
 *
 * Bố cục theo cụm:
 *  - reading   : pipeline đọc lá số — xếp cột theo ĐỘ SÂU tính từ cạnh flowsTo
 *                (vision/logic → psychology → alignment → report → mentor → judge).
 *  - tool      : công cụ tính cách/tarot (hàng ngang); cái nào chảy vào Cẩm Nang
 *                thì gắn nhãn "chảy vào Cẩm Nang".
 *  - master    : báo cáo cao cấp (Cẩm Nang).
 *  - assistant : trợ lý đứng ngoài pipeline.
 *
 * Click node → cuộn tới card role tương ứng (id={`role-card-<role>`}).
 */

type Group = NonNullable<PromptMeta['group']>;

export interface DiagramPrompt {
  role: string;
  meta?: PromptMeta;
}

interface Node {
  role: string;
  label: string;
  note: string;
  stage: number | null;
  wiring: PromptWiring;
  group: Group;
  flowsTo: string[];
}

const GROUP_TITLE: Record<Group, string> = {
  reading: 'Pipeline đọc lá số',
  tool: 'Công cụ tính cách & Tarot',
  master: 'Báo cáo cao cấp',
  assistant: 'Trợ lý đứng ngoài pipeline',
};
const GROUP_ORDER: Group[] = ['reading', 'tool', 'master', 'assistant'];

/** Chấm màu theo cách đấu dây (khớp WiringBadge): xanh lá=sửa-là-ăn-ngay,
 *  xanh dương=đồng bộ code, hổ phách=bản chuẩn trong code. */
const WIRING_DOT: Record<PromptWiring, string> = {
  kv_live: 'bg-emerald-500',
  code_synced: 'bg-sky-500',
  code_inline: 'bg-amber-500',
};

/** Tách "Vision — mắt đọc ảnh" thành nhãn ngắn + ghi chú. */
function splitLabel(raw: string): { label: string; note: string } {
  const i = raw.indexOf('—');
  if (i < 0) return { label: raw.trim(), note: '' };
  return { label: raw.slice(0, i).trim(), note: raw.slice(i + 1).trim() };
}

/** Độ sâu (longest-path) trong 1 cụm, tính từ cạnh flowsTo nội cụm. DAG nhỏ. */
function depthsWithin(nodes: Node[]): Map<string, number> {
  const inSet = new Set(nodes.map((n) => n.role));
  const depth = new Map<string, number>();
  for (const n of nodes) depth.set(n.role, 0);
  for (let iter = 0; iter < nodes.length; iter++) {
    let changed = false;
    for (const n of nodes) {
      const dn = depth.get(n.role) ?? 0;
      for (const t of n.flowsTo) {
        if (inSet.has(t) && (depth.get(t) ?? 0) < dn + 1) {
          depth.set(t, dn + 1);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
  return depth;
}

export function PipelineDiagram({ prompts }: { prompts: DiagramPrompt[] }) {
  const nodes: Node[] = React.useMemo(() => {
    return prompts
      .filter((p) => Boolean(p.meta?.group))
      .map((p) => {
        const meta = p.meta!;
        const { label, note } = splitLabel(meta.label);
        return {
          role: p.role,
          label,
          note,
          stage: meta.stage,
          wiring: meta.wiring,
          group: meta.group!,
          flowsTo: meta.flowsTo ?? [],
        };
      });
  }, [prompts]);

  const byGroup = React.useMemo(() => {
    const m: Record<Group, Node[]> = { reading: [], tool: [], master: [], assistant: [] };
    for (const n of nodes) m[n.group].push(n);
    return m;
  }, [nodes]);

  const roleToGroup = React.useMemo(
    () => new Map(nodes.map((n) => [n.role, n.group])),
    [nodes],
  );

  // Worker cũ chưa deploy PROMPT_GRAPH → không render (card list vẫn hiển thị đủ).
  if (nodes.length === 0) return null;

  return (
    <Card className="border-gold/15">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Sơ đồ kết nối {nodes.length} prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {GROUP_ORDER.filter((g) => byGroup[g].length > 0).map((g) => (
          <GroupBlock key={g} title={GROUP_TITLE[g]} group={g} nodes={byGroup[g]} roleToGroup={roleToGroup} />
        ))}
        <Legend />
      </CardContent>
    </Card>
  );
}

function GroupBlock({
  title,
  group,
  nodes,
  roleToGroup,
}: {
  title: string;
  group: Group;
  nodes: Node[];
  roleToGroup: Map<string, Group>;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <span className="h-px flex-1 bg-gold/10" />
      </div>
      <div className="overflow-x-auto pb-1">
        {group === 'reading' ? (
          <ReadingFlow nodes={nodes} />
        ) : (
          <FlatRow nodes={nodes} roleToGroup={roleToGroup} />
        )}
      </div>
    </div>
  );
}

/** Cụm reading: xếp cột theo độ sâu, mũi tên giữa các cột. */
function ReadingFlow({ nodes }: { nodes: Node[] }) {
  const depth = depthsWithin(nodes);
  const d = (role: string) => depth.get(role) ?? 0;
  const maxDepth = Math.max(0, ...nodes.map((n) => d(n.role)));
  const columns: Node[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const n of nodes) columns[d(n.role)]!.push(n);
  for (const col of columns) col.sort((a, b) => (a.stage ?? 99) - (b.stage ?? 99));

  return (
    <div className="flex min-w-max items-center gap-2">
      <IoNode label="Ảnh bàn tay + Số liệu lá số tính sẵn" />
      {columns.map((col, i) => (
        <React.Fragment key={i}>
          <Arrow />
          <div className="flex flex-col gap-2">
            {col.map((n) => (
              <RoleNode key={n.role} node={n} />
            ))}
          </div>
        </React.Fragment>
      ))}
      <Arrow />
      <IoNode label="Báo cáo user đọc" />
    </div>
  );
}

/** Cụm phẳng (tool/master/assistant): hàng ngang, gắn nhãn cạnh liên-cụm. */
function FlatRow({
  nodes,
  roleToGroup,
}: {
  nodes: Node[];
  roleToGroup: Map<string, Group>;
}) {
  return (
    <div className="flex min-w-max flex-wrap items-start gap-2">
      {nodes.map((n) => {
        // Cạnh chảy sang cụm KHÁC (vd DISC → Cẩm Nang) → nhãn nhỏ dưới node.
        const crossLinks = n.flowsTo.filter(
          (t) => roleToGroup.get(t) && roleToGroup.get(t) !== n.group,
        );
        return (
          <div key={n.role} className="flex flex-col items-start gap-1">
            <RoleNode node={n} />
            {crossLinks.map((t) => (
              <span
                key={t}
                className="ml-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground"
              >
                <CornerDownRight className="h-3 w-3 text-gold/50" aria-hidden />
                chảy vào {t === 'life_manual' ? 'Cẩm Nang' : t}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function Arrow() {
  return <ArrowRight className="h-4 w-4 shrink-0 text-gold/60" aria-hidden />;
}

/** Node vào/ra (không click được, viền đứt). */
function IoNode({ label }: { label: string }) {
  return (
    <span className="inline-flex max-w-[150px] items-center rounded-md border border-dashed border-border bg-muted/20 px-2.5 py-1.5 text-[11px] leading-4 text-muted-foreground">
      {label}
    </span>
  );
}

/** Node role — click cuộn tới card role tương ứng trên trang list. */
function RoleNode({ node }: { node: Node }) {
  const handleClick = React.useCallback(() => {
    document
      .getElementById(`role-card-${node.role}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [node.role]);
  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Cuộn tới thẻ ${node.label}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-gold/25 bg-gold/10 px-2.5 py-1.5 text-left text-[11px] leading-4 text-foreground transition-all duration-300 ease-editorial hover:border-gold/60 hover:bg-gold/15 focus:outline-none focus-visible:border-gold/60"
    >
      {node.stage !== null && (
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-[9px] text-gold">
          {node.stage}
        </span>
      )}
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${WIRING_DOT[node.wiring]}`}
        aria-hidden
      />
      <span className="whitespace-nowrap">
        <span className="font-medium text-gold">{node.label}</span>
        {node.note && <span className="ml-1 text-muted-foreground">{node.note}</span>}
      </span>
    </button>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-gold/15 pt-3 text-[10px] text-muted-foreground">
      <span>Chấm màu = cách sửa có hiệu lực:</span>
      <LegendDot className="bg-emerald-500" label="Sửa là áp dụng ngay" />
      <LegendDot className="bg-sky-500" label="Chạy trong code — đã đồng bộ" />
      <LegendDot className="bg-amber-500" label="Chạy trong code — bản chuẩn" />
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${className}`} aria-hidden />
      {label}
    </span>
  );
}

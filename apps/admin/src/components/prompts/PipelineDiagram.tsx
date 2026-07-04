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
 * Bố cục vẽ ĐƯỜNG NỐI THẬT (không chỉ nhãn chữ):
 *  - reading  : pipeline đọc lá số — xếp cột theo ĐỘ SÂU (vision/logic →
 *               psychology → alignment → report → mentor → judge), mũi tên giữa cột.
 *  - hội tụ   : mọi node (bất kể nhóm) có cạnh flowsTo trỏ sang một node MASTER
 *               (Cẩm Nang) được gom thành CỘT FEEDER → mũi tên → node master. Đây
 *               là chỗ trước đây chỉ ghi chữ "chảy vào Cẩm Nang" mà không có đường.
 *  - còn lại  : công cụ đứng riêng (Tarot, Chiêm tinh), nội dung định kỳ, trợ lý
 *               ngoài pipeline — hàng ngang; cạnh nối-chéo (nếu có) vẫn gắn nhãn.
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
  ingests: string[];
}

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
          ingests: meta.ingests ?? [],
        };
      });
  }, [prompts]);

  const byGroup = React.useMemo(() => {
    const m: Record<Group, Node[]> = { reading: [], tool: [], master: [], daily: [], assistant: [] };
    for (const n of nodes) m[n.group].push(n);
    return m;
  }, [nodes]);

  const roleToGroup = React.useMemo(
    () => new Map(nodes.map((n) => [n.role, n.group])),
    [nodes],
  );

  // Hội tụ: mỗi node MASTER + các feeder (node nhóm khác trỏ flowsTo vào nó) được
  // vẽ thành 1 khối [cột feeder] → [master]. Đây là đường nối trước đây thiếu.
  const { converge, feederRoles, convergedMasters } = React.useMemo(() => {
    const feederRoles = new Set<string>();
    const convergedMasters = new Set<string>();
    const converge = byGroup.master
      .map((master) => {
        const feeders = nodes
          .filter((n) => n.group !== 'master' && n.flowsTo.includes(master.role))
          .sort((a, b) => a.label.localeCompare(b.label, 'vi'));
        return { master, feeders };
      })
      .filter((c) => c.feeders.length > 0);
    for (const c of converge) {
      convergedMasters.add(c.master.role);
      for (const f of c.feeders) feederRoles.add(f.role);
    }
    return { converge, feederRoles, convergedMasters };
  }, [nodes, byGroup]);

  // Node còn lại của từng nhóm phẳng (đã trừ feeder + master đã hội tụ).
  const leftover: Record<Exclude<Group, 'reading'>, Node[]> = React.useMemo(
    () => ({
      tool: byGroup.tool.filter((n) => !feederRoles.has(n.role)),
      master: byGroup.master.filter((n) => !convergedMasters.has(n.role)),
      daily: byGroup.daily,
      assistant: byGroup.assistant,
    }),
    [byGroup, feederRoles, convergedMasters],
  );

  const LEFTOVER_TITLE: Record<Exclude<Group, 'reading'>, string> = {
    tool: 'Công cụ đọc riêng',
    master: 'Báo cáo cao cấp',
    daily: 'Nội dung định kỳ',
    assistant: 'Trợ lý đứng ngoài pipeline',
  };

  // Worker cũ chưa deploy PROMPT_GRAPH → không render (card list vẫn hiển thị đủ).
  if (nodes.length === 0) return null;

  return (
    <Card className="border-gold/15">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Sơ đồ kết nối {nodes.length} prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {byGroup.reading.length > 0 && (
          <DiagramSection title="Pipeline đọc lá số">
            <ReadingFlow nodes={byGroup.reading} />
          </DiagramSection>
        )}

        {converge.map((c) => (
          <DiagramSection key={c.master.role} title={`Công cụ → ${c.master.label}`}>
            <ConvergeFlow feeders={c.feeders} target={c.master} />
          </DiagramSection>
        ))}

        {(['tool', 'master', 'daily', 'assistant'] as const)
          .filter((g) => leftover[g].length > 0)
          .map((g) => (
            <DiagramSection key={g} title={LEFTOVER_TITLE[g]}>
              <FlatRow nodes={leftover[g]} roleToGroup={roleToGroup} />
            </DiagramSection>
          ))}

        <Legend />
      </CardContent>
    </Card>
  );
}

function DiagramSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <span className="h-px flex-1 bg-gold/10" />
      </div>
      <div className="overflow-x-auto pb-1">{children}</div>
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

/** Khối hội tụ: cột feeder (các công cụ) → mũi tên → node master (Cẩm Nang). */
function ConvergeFlow({ feeders, target }: { feeders: Node[]; target: Node }) {
  return (
    <div className="flex min-w-max items-center gap-3">
      <div className="flex flex-col gap-2">
        {feeders.map((n) => (
          <RoleNode key={n.role} node={n} />
        ))}
        {target.ingests.length > 0 && (
          <div className="mt-1 rounded-md border border-dashed border-border/70 bg-muted/10 p-1.5">
            <div className="mb-1 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
              + lăng kính engine (không qua prompt)
            </div>
            <div className="flex flex-wrap gap-1">
              {target.ingests.map((x) => (
                <span
                  key={x}
                  className="inline-flex items-center rounded border border-dashed border-border bg-muted/20 px-1.5 py-0.5 text-[10px] leading-4 text-muted-foreground"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <Arrow />
        <span className="mt-0.5 text-[9px] text-muted-foreground">gộp vào</span>
      </div>
      <RoleNode node={target} emphasis />
    </div>
  );
}

/** Cụm phẳng (leftover): hàng ngang, gắn nhãn cạnh nối-chéo còn lại (nếu có). */
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

/** Node role — click cuộn tới card role tương ứng trên trang list. `emphasis`
 *  làm nổi node đích của khối hội tụ (Cẩm Nang). */
function RoleNode({ node, emphasis = false }: { node: Node; emphasis?: boolean }) {
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
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-left text-[11px] leading-4 text-foreground transition-all duration-300 ease-editorial focus:outline-none focus-visible:border-gold/60 ${
        emphasis
          ? 'border-gold/60 bg-gold/20 shadow-sm hover:bg-gold/25'
          : 'border-gold/25 bg-gold/10 hover:border-gold/60 hover:bg-gold/15'
      }`}
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
        <span className={`font-medium text-gold${emphasis ? ' font-semibold' : ''}`}>{node.label}</span>
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

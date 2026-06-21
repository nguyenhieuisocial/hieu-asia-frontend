'use client';

/**
 * SystemMapFlow — interactive (pan/zoom) system topology on React Flow.
 *
 * Lazy-loaded (heavy lib) from /architecture as the "Tương tác" view. Builds
 * nodes from ARCH_LAYERS (layered top-down layout) + edges from ARCH_EDGES,
 * carries the same LIVE status dots, and routes each edge through the handle
 * facing its target (so cross-layer edges stay tidy). Click a node → its admin
 * page. Bundled + same-origin → fine under the admin's strict CSP.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ARCH_LAYERS, ARCH_EDGES } from '@/lib/architecture';
import { layoutLayeredDag } from '@/lib/flow-layout';

export type Live = 'ok' | 'warn' | 'down' | 'unknown' | 'loading';

interface NodeData {
  label: string;
  role: string;
  status?: Live;
  core?: boolean;
  adminHref?: string;
  externalHref?: string;
  [key: string]: unknown;
}

// Fixed node box size (matches the w-[210px] node card) fed to dagre so ranks
// don't overlap. ~64px tall = label row + 2-line role.
const NODE_W = 210;
const NODE_H = 64;
const DOT: Record<Live, string> = {
  ok: '#3fae8f',
  warn: '#d9a441',
  down: '#ef4444',
  unknown: '#9b9384',
  loading: '#9b9384',
};

const ArchNodeView = React.memo(function ArchNodeView({ data }: NodeProps<Node<NodeData>>) {
  const s = data.status;
  return (
    <div
      className={[
        'w-[210px] rounded-md border px-3 py-2 text-left shadow-sm',
        data.core
          ? 'border-gold bg-gold/15'
          : 'border-border bg-card',
        data.adminHref || data.externalHref ? 'cursor-pointer hover:border-gold/60' : '',
      ].join(' ')}
    >
      <Handle type="target" position={Position.Top} id="t-top" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="t-bot" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} id="s-top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="s-bot" style={{ opacity: 0 }} />
      <div className="flex items-center gap-1.5">
        {s ? (
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: DOT[s], opacity: s === 'loading' ? 0.4 : 1 }}
          />
        ) : null}
        <span className="truncate text-[13px] font-medium text-foreground">{data.label}</span>
      </div>
      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground">{data.role}</p>
    </div>
  );
});

const nodeTypes = { arch: ArchNodeView };

export interface SystemMapFlowProps {
  statuses: Record<string, Live>;
}

export default function SystemMapFlow({ statuses }: SystemMapFlowProps) {
  const router = useRouter();

  // Node id → layer index, for edge handle direction.
  const layerOf = React.useMemo(() => {
    const m: Record<string, number> = {};
    ARCH_LAYERS.forEach((l, li) => l.nodes.forEach((n) => (m[n.id] = li)));
    return m;
  }, []);

  const nodes: Node<NodeData>[] = React.useMemo(() => {
    const flat = ARCH_LAYERS.flatMap((layer) => layer.nodes);
    // dagre layered layout (TB) from the real ARCH_EDGES — ranks fall out of the
    // graph, so we no longer hand-center each layer. positions = TOP-LEFT.
    const positions = layoutLayeredDag(
      flat.map((n) => ({ id: n.id, width: NODE_W, height: NODE_H })),
      ARCH_EDGES.map((e) => ({ source: e.source, target: e.target })),
      { rankdir: 'TB', nodesep: 55, ranksep: 95 },
    );
    return flat.map((n) => ({
      id: n.id,
      type: 'arch',
      position: positions.get(n.id) ?? { x: 0, y: 0 },
      data: {
        label: n.label,
        role: n.role,
        core: n.core,
        adminHref: n.adminHref,
        externalHref: n.externalHref,
        status: n.infraSlug ? statuses[n.infraSlug] ?? 'unknown' : undefined,
      },
      draggable: false,
    }));
  }, [statuses]);

  const edges: Edge[] = React.useMemo(
    () =>
      ARCH_EDGES.map((e, i) => {
        const down = (layerOf[e.target] ?? 0) >= (layerOf[e.source] ?? 0);
        const color = e.kind === 'monitor' ? '#9b9384' : e.kind === 'deploy' ? '#8b7fc7' : '#c9a24a';
        return {
          id: `e${i}`,
          source: e.source,
          target: e.target,
          sourceHandle: down ? 's-bot' : 's-top',
          targetHandle: down ? 't-top' : 't-bot',
          label: e.label,
          animated: e.kind === 'flow',
          style: {
            stroke: color,
            strokeWidth: 1.5,
            strokeDasharray: e.kind === 'flow' ? undefined : '5 4',
          },
          labelStyle: { fontSize: 10, fill: 'var(--color-muted-foreground, #9b9384)' },
          labelBgStyle: { fill: 'var(--color-card, #f5f1e8)', fillOpacity: 0.85 },
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
        };
      }),
    [layerOf],
  );

  const onNodeClick = React.useCallback(
    (_: React.MouseEvent, node: Node) => {
      const d = node.data as NodeData;
      if (d.adminHref) router.push(d.adminHref);
      else if (d.externalHref) window.open(d.externalHref, '_blank', 'noopener,noreferrer');
    },
    [router],
  );

  return (
    <div className="h-[70vh] min-h-[460px] w-full overflow-hidden rounded-lg border border-gold/15 bg-card/40">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={1.5}
        onlyRenderVisibleElements
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        edgesFocusable={false}
      >
        <Background gap={20} size={1} color="var(--color-border, #e7e0d2)" />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable nodeStrokeWidth={2} className="!bg-card/80" />
      </ReactFlow>
    </div>
  );
}

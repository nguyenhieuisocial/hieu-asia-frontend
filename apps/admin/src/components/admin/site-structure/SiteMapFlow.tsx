'use client';

/**
 * SiteMapFlow — interactive (pan/zoom) sitemap graph on React Flow.
 *
 * Lazy-loaded (heavy lib) from /site-structure as the "Tương tác" view, for ONE
 * selected app at a time. Section blocks (a section header + its page nodes
 * stacked underneath) are laid out in a grid that WRAPS — columns ≈ √(sections),
 * capped — so a wide app doesn't form one ~22,000px-wide row. Dynamic `[param]`
 * routes inside a section collapse into a single node labelled with the count.
 * Solid edges = section → page (hierarchy); dashed gold edges = cross-links
 * between pages (linksTo). Click a page node → open its live URL in a new tab.
 * Mirrors SystemMapFlow's dynamic-safe structure (bundled, same-origin → fine
 * under the admin's strict CSP).
 */

import * as React from 'react';
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
import type { AppGroup } from '@/lib/site-structure';
import { layoutSectionSubtree } from '@/lib/flow-layout';

// A page row that already had its dynamic siblings collapsed into one node.
interface FlowPage {
  /** Stable node id (route, or `section::dynamic` for the collapsed group). */
  id: string;
  /** Display label (route pattern). */
  route: string;
  /** Short function/title shown on the node + as title attr. */
  fn: string;
  section: string;
  /** Live URL to open on click (undefined for a collapsed dynamic group). */
  href?: string;
  /** Number of routes this node represents (>1 for a collapsed group). */
  count: number;
}

interface SectionNodeData {
  kind: 'section';
  label: string;
  pages: number;
  color: string;
  [key: string]: unknown;
}

interface PageNodeData {
  kind: 'page';
  label: string;
  fn: string;
  color: string;
  href?: string;
  count: number;
  [key: string]: unknown;
}

type AnyData = SectionNodeData | PageNodeData;

// Fixed node-box sizes (match the w-[210px] cards) fed to dagre. ~58px section
// header (label + "section" caption), ~62px page row (label + 1-line fn).
const NODE_W = 210;
const SECTION_NODE_H = 58;
const PAGE_NODE_H = 62;
// Horizontal stride between grid columns. A section's dagre LR block is a fixed
// width (header column + page column); stride = that block width + a gutter.
const BLOCK_W = 476; // header col + ranksep + page col (matches dagre LR output)
const COL_STRIDE = BLOCK_W + 60;
const SECTION_ROW_Y = 0;
// Vertical gap between two grid-rows of section blocks (below the tallest block
// in the row above), so variable-height sections never overlap.
const ROW_GUTTER = 80;
// Cap so a wide app (web has ~85 sections) wraps instead of forming a single
// ~22,000px row. Columns ≈ √(sections), capped — keeps the grid roughly square
// and bounded in width. Capped at 4 because each LR block is ~480px wide
// (wider than the old 210px stacks), so 4 columns keeps the canvas < ~2200px.
const MAX_COLS = 4;

// A stable, readable palette cycled across sections (group-by-section color).
const SECTION_COLORS = [
  '#c9a24a', // gold
  '#3fae8f', // jade
  '#8b7fc7', // purple
  '#d9776a', // clay
  '#5b9bd5', // sky
  '#d9a441', // amber
  '#7aa874', // sage
  '#c77fae', // rose
];

function colorForSection(index: number): string {
  return SECTION_COLORS[index % SECTION_COLORS.length] ?? '#c9a24a';
}

// Memoized so panning/zooming a 180+ node graph doesn't re-render every node on
// each viewport tick (nodes are pure functions of `data`, which is stable).
const SectionNodeView = React.memo(function SectionNodeView({ data }: NodeProps<Node<SectionNodeData>>) {
  return (
    <div
      className="w-[210px] rounded-md border-2 px-3 py-2 text-left shadow-sm"
      style={{ borderColor: data.color, background: `${data.color}1a` }}
    >
      <Handle type="source" position={Position.Right} id="s-right" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="s-bot" style={{ opacity: 0 }} />
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[13px] font-semibold text-foreground">{data.label}</span>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{data.pages}</span>
      </div>
      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">section</p>
    </div>
  );
});

const PageNodeView = React.memo(function PageNodeView({ data }: NodeProps<Node<PageNodeData>>) {
  return (
    <div
      className={[
        'w-[210px] rounded-md border bg-card px-3 py-2 text-left shadow-sm',
        data.href ? 'cursor-pointer hover:border-gold/60' : '',
      ].join(' ')}
      style={{ borderColor: `${data.color}66` }}
      title={data.fn}
    >
      <Handle type="target" position={Position.Left} id="t-left" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} id="t-top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="s-bot" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="t-bot" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} id="s-top" style={{ opacity: 0 }} />
      <div className="flex items-center gap-1.5">
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="truncate text-[12px] font-medium text-foreground">{data.label}</span>
        {data.count > 1 && (
          <span className="ml-auto shrink-0 rounded bg-muted/50 px-1 font-mono text-[9px] text-muted-foreground">
            ×{data.count}
          </span>
        )}
      </div>
      <p className="mt-0.5 line-clamp-1 text-[10px] leading-snug text-muted-foreground">{data.fn}</p>
    </div>
  );
});

const nodeTypes = { section: SectionNodeView, page: PageNodeView };

export interface SiteMapFlowProps {
  /** The selected app group (already chosen by the parent). */
  group: AppGroup;
  /** Maps a route → its live URL (app-aware), or undefined if none. */
  liveUrlFor: (route: string) => string | undefined;
}

export default function SiteMapFlow({ group, liveUrlFor }: SiteMapFlowProps) {
  // Build the per-section collapsed page list (dynamic siblings → one node) and
  // the flat lookup route → node id, used to wire cross-link edges.
  const { sectionFlowPages, routeToNodeId } = React.useMemo(() => {
    const perSection: { id: string; title: string; pages: FlowPage[] }[] = [];
    const lookup = new Map<string, string>();

    for (const section of group.sections) {
      const staticPages: FlowPage[] = [];
      const dynamicRoutes: string[] = [];

      for (const p of section.pages) {
        if (p.dynamic) {
          dynamicRoutes.push(p.route);
          // Dynamic routes map to the collapsed group node.
          lookup.set(p.route, `${section.id}::dynamic`);
        } else {
          const node: FlowPage = {
            id: p.route,
            route: p.route,
            fn: p.fn,
            section: section.id,
            href: liveUrlFor(p.route),
            count: 1,
          };
          staticPages.push(node);
          lookup.set(p.route, p.route);
        }
      }

      const pages = [...staticPages];
      if (dynamicRoutes.length > 0) {
        pages.push({
          id: `${section.id}::dynamic`,
          route: `${section.id}/[…] động`,
          fn: `${dynamicRoutes.length} route động: ${dynamicRoutes.slice(0, 4).join(', ')}${dynamicRoutes.length > 4 ? '…' : ''}`,
          section: section.id,
          href: undefined,
          count: dynamicRoutes.length,
        });
      }

      perSection.push({ id: section.id, title: section.title, pages });
    }

    return { sectionFlowPages: perSection, routeToNodeId: lookup };
  }, [group, liveUrlFor]);

  const nodes: Node<AnyData>[] = React.useMemo(() => {
    const out: Node<AnyData>[] = [];

    // Lay the section blocks (each = section header + its page nodes) in a grid
    // that WRAPS, instead of one ever-widening horizontal row. Columns
    // ≈ √(sections), capped at MAX_COLS, so the canvas width stays bounded.
    const cols = Math.max(1, Math.min(MAX_COLS, Math.ceil(Math.sqrt(sectionFlowPages.length))));

    // Each grid-row's Y is the previous row's Y plus the tallest section block in
    // that previous row (measured by dagre), so variable-height sections never
    // overlap. + a gutter between rows.
    let rowYOffset = SECTION_ROW_Y;
    let rowMaxBlockH = 0;

    sectionFlowPages.forEach((section, si) => {
      const col = si % cols;
      // At the start of each new grid-row, advance Y past the tallest block above.
      if (col === 0 && si > 0) {
        rowYOffset += rowMaxBlockH + ROW_GUTTER;
        rowMaxBlockH = 0;
      }

      const color = colorForSection(si);
      const headerId = `sec::${section.id}`;
      // dagre lays out THIS section's tree only (header → its pages). Cross-links
      // are NOT fed in — each section stays a small bounded tree, never one wide
      // graph. Returns relative TOP-LEFT positions + the measured block size.
      const { positions, height: blockH } = layoutSectionSubtree(
        headerId,
        section.pages.map((p) => p.id),
        {
          nodeWidth: NODE_W,
          sectionHeight: SECTION_NODE_H,
          pageHeight: PAGE_NODE_H,
        },
      );
      if (blockH > rowMaxBlockH) rowMaxBlockH = blockH;

      const originX = col * COL_STRIDE;
      const originY = rowYOffset;
      const headerPos = positions.get(headerId) ?? { x: 0, y: 0 };
      // Section header node.
      out.push({
        id: headerId,
        type: 'section',
        position: { x: originX + headerPos.x, y: originY + headerPos.y },
        data: { kind: 'section', label: section.title, pages: section.pages.length, color },
        draggable: false,
      });
      // Page nodes placed by dagre, offset to this block's grid origin.
      section.pages.forEach((p) => {
        const rel = positions.get(p.id) ?? { x: 0, y: 0 };
        out.push({
          id: p.id,
          type: 'page',
          position: { x: originX + rel.x, y: originY + rel.y },
          data: { kind: 'page', label: p.route, fn: p.fn, color, href: p.href, count: p.count },
          draggable: false,
        });
      });
    });
    return out;
  }, [sectionFlowPages]);

  const edges: Edge[] = React.useMemo(() => {
    const out: Edge[] = [];

    // Hierarchy edges: section → each of its page nodes (solid, section color).
    sectionFlowPages.forEach((section, si) => {
      const color = colorForSection(si);
      section.pages.forEach((p) => {
        out.push({
          id: `h::${section.id}::${p.id}`,
          source: `sec::${section.id}`,
          target: p.id,
          // header is LEFT of its page column (dagre LR) → exit right, enter left.
          sourceHandle: 's-right',
          targetHandle: 't-left',
          type: 'smoothstep',
          style: { stroke: `${color}99`, strokeWidth: 1.25 },
        });
      });
    });

    // Cross-link edges: page → page (linksTo), only when BOTH ends are in this
    // app's graph. De-dupe so collapsed dynamic nodes don't get N identical edges.
    const seen = new Set<string>();
    for (const section of group.sections) {
      for (const p of section.pages) {
        const sourceId = routeToNodeId.get(p.route);
        if (!sourceId) continue;
        for (const target of p.linksTo) {
          const targetId = routeToNodeId.get(target);
          if (!targetId || targetId === sourceId) continue;
          const key = `${sourceId}->${targetId}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({
            id: `x::${key}`,
            source: sourceId,
            target: targetId,
            sourceHandle: 's-bot',
            targetHandle: 't-top',
            style: { stroke: '#c9a24a', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.55 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#c9a24a', width: 12, height: 12 },
          });
        }
      }
    }

    return out;
  }, [sectionFlowPages, group, routeToNodeId]);

  const onNodeClick = React.useCallback((_: React.MouseEvent, node: Node) => {
    const d = node.data as AnyData;
    if (d.kind === 'page' && d.href) {
      window.open(d.href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <div className="h-[70vh] min-h-[460px] w-full overflow-hidden rounded-lg border border-gold/15 bg-card/40">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
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

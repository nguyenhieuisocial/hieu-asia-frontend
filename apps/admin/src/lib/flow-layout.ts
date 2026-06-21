/**
 * flow-layout.ts — pure dagre auto-layout helpers for the admin React Flow maps.
 *
 * No React import: deterministic, side-effect-free position math the flow
 * components call inside their `nodes` useMemo (SYNC, not useEffect). Two shapes:
 *
 *  - `layoutLayeredDag`     — one layered DAG (the /architecture system map).
 *  - `layoutSectionSubtree` — one section's (header → its pages) tree, returning
 *                             relative positions + a measured block size so the
 *                             sitemap's grid-wrap can pack blocks without overlap.
 *
 * IMPORTANT: dagre reports NODE CENTERS; React Flow's `position` is the TOP-LEFT
 * corner. Every mapping here subtracts width/2 and height/2 to convert.
 *
 * dagre is imported ONLY here (and re-exported through the lazy flow chunks), so
 * it rides the existing lazy "Tương tác" bundle and never touches the admin's
 * initial JS.
 */

import dagre from '@dagrejs/dagre';

export interface XY {
  x: number;
  y: number;
}

export interface LayoutNodeInput {
  id: string;
  /** Rendered node box width in px (React Flow node is fixed-size). */
  width: number;
  /** Rendered node box height in px. */
  height: number;
}

export interface LayoutEdgeInput {
  source: string;
  target: string;
}

export interface LayeredDagOpts {
  /** dagre rank direction. Default 'TB' (top→bottom). */
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL';
  /** Gap between nodes in the same rank. */
  nodesep?: number;
  /** Gap between ranks. */
  ranksep?: number;
}

/**
 * Lay out a layered DAG with dagre and return TOP-LEFT positions keyed by node
 * id. Edges only steer ranking — node sizes come from the inputs. Nodes absent
 * from `edges` still get placed (dagre keeps isolated nodes on rank 0).
 */
export function layoutLayeredDag(
  nodes: LayoutNodeInput[],
  edges: LayoutEdgeInput[],
  opts: LayeredDagOpts = {},
): Map<string, XY> {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: opts.rankdir ?? 'TB',
    nodesep: opts.nodesep ?? 60,
    ranksep: opts.ranksep ?? 90,
    marginx: 8,
    marginy: 8,
  });
  // Edges carry no label/dimensions of their own.
  g.setDefaultEdgeLabel(() => ({}));

  for (const n of nodes) {
    g.setNode(n.id, { width: n.width, height: n.height });
  }
  // Only wire edges whose BOTH endpoints are real nodes (a stray edge to an
  // unknown id would make dagre invent a phantom node).
  const known = new Set(nodes.map((n) => n.id));
  for (const e of edges) {
    if (known.has(e.source) && known.has(e.target)) {
      g.setEdge(e.source, e.target);
    }
  }

  dagre.layout(g);

  const out = new Map<string, XY>();
  for (const n of nodes) {
    const pos = g.node(n.id);
    // dagre gives the CENTER → convert to React Flow's TOP-LEFT.
    out.set(n.id, { x: pos.x - n.width / 2, y: pos.y - n.height / 2 });
  }
  return out;
}

export interface SectionSubtreeResult {
  /** TOP-LEFT positions relative to the block's own origin (0,0). */
  positions: Map<string, XY>;
  /** Measured block bounding-box width (for grid packing). */
  width: number;
  /** Measured block bounding-box height (for grid packing). */
  height: number;
}

export interface SectionSubtreeOpts {
  /** Width of every node box in this block. */
  nodeWidth: number;
  /** Height of the section-header node box. */
  sectionHeight: number;
  /** Height of each page node box. */
  pageHeight: number;
  /** Gap between sibling page nodes. Default 16. */
  nodesep?: number;
  /** Gap between the header rank and the page rank. Default 56. */
  ranksep?: number;
}

/**
 * Lay out ONE section as a small dagre LR tree: the section header on the LEFT,
 * its page nodes stacked in a single column to its RIGHT. LR (not TB) keeps the
 * block a FIXED width (header col + page col) that grows TALL with page count —
 * so packing many sections in a grid stays width-bounded (a TB tree fans pages
 * out sideways and blows the width up). Returns relative TOP-LEFT positions plus
 * the measured block size (dagre's graph().width/height) for grid packing.
 *
 * Only the header→page hierarchy is fed in. Cross-links are intentionally NOT a
 * dagre input — keeping each section a small, bounded tree (not one giant graph).
 */
export function layoutSectionSubtree(
  sectionHeaderId: string,
  pageNodeIds: string[],
  opts: SectionSubtreeOpts,
): SectionSubtreeResult {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'LR',
    nodesep: opts.nodesep ?? 16,
    ranksep: opts.ranksep ?? 56,
    marginx: 0,
    marginy: 0,
  });
  g.setDefaultEdgeLabel(() => ({}));

  g.setNode(sectionHeaderId, { width: opts.nodeWidth, height: opts.sectionHeight });
  for (const pid of pageNodeIds) {
    g.setNode(pid, { width: opts.nodeWidth, height: opts.pageHeight });
    g.setEdge(sectionHeaderId, pid);
  }

  dagre.layout(g);

  const positions = new Map<string, XY>();
  const place = (id: string, w: number, h: number) => {
    const pos = g.node(id);
    positions.set(id, { x: pos.x - w / 2, y: pos.y - h / 2 });
  };
  place(sectionHeaderId, opts.nodeWidth, opts.sectionHeight);
  for (const pid of pageNodeIds) place(pid, opts.nodeWidth, opts.pageHeight);

  const graphLabel = g.graph();
  return {
    positions,
    width: graphLabel.width ?? opts.nodeWidth,
    height: graphLabel.height ?? opts.sectionHeight,
  };
}

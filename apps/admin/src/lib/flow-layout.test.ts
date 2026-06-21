import { describe, expect, it } from 'vitest';
import {
  layoutLayeredDag,
  layoutSectionSubtree,
  type LayoutEdgeInput,
  type LayoutNodeInput,
} from './flow-layout';

const NODE_W = 210;
const SECTION_H = 58;
const PAGE_H = 62;

/** Axis-aligned rect overlap (touching edges = not overlapping). */
function overlaps(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

describe('layoutSectionSubtree', () => {
  it('places header + pages with no overlapping node rects', () => {
    const pages = ['/a', '/b', '/c', '/d', '/e'];
    const { positions, width, height } = layoutSectionSubtree('sec', pages, {
      nodeWidth: NODE_W,
      sectionHeight: SECTION_H,
      pageHeight: PAGE_H,
    });

    expect(positions.size).toBe(pages.length + 1);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);

    const rects = [
      { id: 'sec', ...positions.get('sec')!, w: NODE_W, h: SECTION_H },
      ...pages.map((p) => ({ id: p, ...positions.get(p)!, w: NODE_W, h: PAGE_H })),
    ];
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        expect(overlaps(rects[i]!, rects[j]!), `${rects[i]!.id} overlaps ${rects[j]!.id}`).toBe(
          false,
        );
      }
    }
  });

  it('is deterministic across runs', () => {
    const pages = ['/x', '/y', '/z'];
    const a = layoutSectionSubtree('s', pages, {
      nodeWidth: NODE_W,
      sectionHeight: SECTION_H,
      pageHeight: PAGE_H,
    });
    const b = layoutSectionSubtree('s', pages, {
      nodeWidth: NODE_W,
      sectionHeight: SECTION_H,
      pageHeight: PAGE_H,
    });
    expect(JSON.stringify([...a.positions])).toBe(JSON.stringify([...b.positions]));
    expect(a.width).toBe(b.width);
    expect(a.height).toBe(b.height);
  });

  it('handles a section with no pages (header only)', () => {
    const { positions, height } = layoutSectionSubtree('solo', [], {
      nodeWidth: NODE_W,
      sectionHeight: SECTION_H,
      pageHeight: PAGE_H,
    });
    expect(positions.size).toBe(1);
    expect(height).toBeGreaterThanOrEqual(SECTION_H);
  });
});

describe('layoutLayeredDag', () => {
  it('positions every node and is deterministic', () => {
    const nodes: LayoutNodeInput[] = [
      { id: 'a', width: NODE_W, height: 64 },
      { id: 'b', width: NODE_W, height: 64 },
      { id: 'c', width: NODE_W, height: 64 },
    ];
    const edges: LayoutEdgeInput[] = [
      { source: 'a', target: 'b' },
      { source: 'a', target: 'c' },
    ];
    const r1 = layoutLayeredDag(nodes, edges, { rankdir: 'TB' });
    const r2 = layoutLayeredDag(nodes, edges, { rankdir: 'TB' });
    expect(r1.size).toBe(3);
    expect(JSON.stringify([...r1])).toBe(JSON.stringify([...r2]));
    // child rank sits below the parent (TB → larger y).
    expect(r1.get('b')!.y).toBeGreaterThan(r1.get('a')!.y);
  });

  it('ignores edges to unknown ids without inventing phantom nodes', () => {
    const nodes: LayoutNodeInput[] = [{ id: 'a', width: NODE_W, height: 64 }];
    const pos = layoutLayeredDag(nodes, [{ source: 'a', target: 'ghost' }]);
    expect(pos.size).toBe(1);
    expect(pos.has('ghost')).toBe(false);
  });
});

describe('packed web-group width stays bounded', () => {
  // Synthetic ~85-section / ~183-node forest, packed exactly like SiteMapFlow:
  // per-section dagre subtree + the grid-wrap (cols ≈ √sections, capped at 6).
  it('keeps the max x-extent under ~3000px for 85 sections / 183 nodes', () => {
    const SECTIONS = 85;
    const MAX_COLS = 4;
    const BLOCK_W = 476; // dagre LR block: header col + page col
    const COL_STRIDE = BLOCK_W + 60;
    const ROW_GUTTER = 80;

    // Distribute ~183 page nodes across 85 sections (1–4 pages each).
    let totalPages = 0;
    const sections = Array.from({ length: SECTIONS }, (_, i) => {
      const n = (i % 4) + 1; // 1..4
      totalPages += n;
      return Array.from({ length: n }, (_, j) => `/s${i}/p${j}`);
    });
    expect(totalPages).toBeGreaterThanOrEqual(180);
    expect(totalPages).toBeLessThanOrEqual(220);

    const cols = Math.max(1, Math.min(MAX_COLS, Math.ceil(Math.sqrt(SECTIONS))));
    let rowYOffset = 0;
    let rowMaxBlockH = 0;
    let maxXExtent = 0;
    let maxYExtent = 0;

    sections.forEach((pageIds, si) => {
      const col = si % cols;
      if (col === 0 && si > 0) {
        rowYOffset += rowMaxBlockH + ROW_GUTTER;
        rowMaxBlockH = 0;
      }
      const { positions, width, height } = layoutSectionSubtree(`sec${si}`, pageIds, {
        nodeWidth: NODE_W,
        sectionHeight: SECTION_H,
        pageHeight: PAGE_H,
      });
      if (height > rowMaxBlockH) rowMaxBlockH = height;
      const originX = col * COL_STRIDE;
      // Right edge of this block = originX + its widest node's right edge.
      for (const { x, y } of positions.values()) {
        maxXExtent = Math.max(maxXExtent, originX + x + NODE_W);
        maxYExtent = Math.max(maxYExtent, rowYOffset + y + PAGE_H);
      }
      // LR block: a fixed width (header col + page col), NOT one-node-wide.
      expect(width).toBeLessThanOrEqual(BLOCK_W + 1);
    });

    // Width stays bounded; the forest grows DOWN (tall), not sideways.
    expect(maxXExtent).toBeLessThan(3000);
    expect(maxYExtent).toBeGreaterThan(maxXExtent);
  });
});

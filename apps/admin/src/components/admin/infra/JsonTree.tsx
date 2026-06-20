'use client';

/**
 * JsonTree — a dependency-free collapsible viewer for a parsed JSON value, used
 * by the /infra/kv value pane. Objects and arrays render as expand/collapse
 * nodes; scalars render inline with type-coloured text. Read-only — there is no
 * editing affordance (KV operational data is browse-only).
 *
 * The pure detect helper `tryParseJson` lives in ./json-tree-parse (a plain .ts
 * module so it's testable in the node vitest env) and is re-exported here.
 */

import * as React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@hieu-asia/ui';

export { tryParseJson } from './json-tree-parse';

function isExpandable(v: unknown): v is Record<string, unknown> | unknown[] {
  return v !== null && typeof v === 'object';
}

/** Inline rendering for a scalar leaf, coloured by JS type. */
function ScalarLeaf({ value }: { value: unknown }): React.ReactElement {
  if (value === null) return <span className="text-muted-foreground">null</span>;
  switch (typeof value) {
    case 'string':
      return <span className="text-jade break-all">&quot;{value}&quot;</span>;
    case 'number':
      return <span className="text-gold">{String(value)}</span>;
    case 'boolean':
      return <span className="text-gold">{String(value)}</span>;
    default:
      return <span className="text-foreground break-all">{String(value)}</span>;
  }
}

interface NodeProps {
  /** The object key or array index label for this node (null at the root). */
  label: string | null;
  value: unknown;
  /** Nodes shallower than this start expanded. */
  defaultExpandDepth: number;
  depth: number;
}

function TreeNode({ label, value, defaultExpandDepth, depth }: NodeProps): React.ReactElement {
  const expandable = isExpandable(value);
  const [open, setOpen] = React.useState<boolean>(depth < defaultExpandDepth);

  const labelEl =
    label != null ? (
      <span className="text-muted-foreground">{label}: </span>
    ) : null;

  if (!expandable) {
    return (
      <div className="flex items-start gap-1 pl-4">
        {labelEl}
        <ScalarLeaf value={value} />
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries: Array<[string, unknown]> = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v])
    : Object.entries(value as Record<string, unknown>);
  const count = entries.length;
  const summary = isArray ? `[${count}]` : `{${count}}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-0.5 rounded text-left hover:bg-gold/5"
      >
        {open ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        )}
        {labelEl}
        <span className="text-muted-foreground/70">{summary}</span>
      </button>
      {open && (
        <div className={cn('border-l border-border/40', depth >= 0 && 'ml-1.5 pl-1.5')}>
          {entries.map(([k, v]) => (
            <TreeNode
              key={k}
              label={k}
              value={v}
              defaultExpandDepth={defaultExpandDepth}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface JsonTreeProps {
  /** A pre-parsed JSON value (object or array). */
  value: unknown;
  /** Nodes shallower than this depth render expanded initially. Default 1. */
  defaultExpandDepth?: number;
  className?: string;
}

export function JsonTree({
  value,
  defaultExpandDepth = 1,
  className,
}: JsonTreeProps): React.ReactElement {
  return (
    <div
      className={cn(
        'max-h-96 overflow-auto rounded-md border border-border bg-muted/30 p-3 font-mono text-xs',
        className,
      )}
    >
      <TreeNode
        label={null}
        value={value}
        defaultExpandDepth={defaultExpandDepth}
        depth={0}
      />
    </div>
  );
}

/**
 * /admin/affiliates/referrals — Wave 43.2
 *
 * Relationship tree visualization (nested list, no chart lib for v1).
 * Builds the tree client-side from /api/admin/affiliates/promoters response.
 * URL query ?root=<user_id> scopes the view to a subtree.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, Input } from '@hieu-asia/ui';

interface PromoterRow {
  user_id: string;
  parent_user_id: string | null;
  affiliate_code: string;
  email: string | null;
  depth: number;
  tier: string;
  status: string;
  l1_count: number;
  l2_count: number;
  l3_count: number;
  total_subtree: number;
  created_at: string;
}

interface TreeNode extends PromoterRow {
  children: TreeNode[];
}

async function fetchPromoters(): Promise<PromoterRow[]> {
  const r = await fetch('/api/admin/affiliates/promoters', { cache: 'no-store' });
  const d = await r.json();
  if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
  return d.promoters as PromoterRow[];
}

function buildTree(rows: PromoterRow[], rootId?: string | null): TreeNode[] {
  const byParent = new Map<string | null, TreeNode[]>();
  const byId = new Map<string, TreeNode>();
  for (const r of rows) {
    byId.set(r.user_id, { ...r, children: [] });
  }
  for (const node of byId.values()) {
    const key = node.parent_user_id;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(node);
  }
  for (const node of byId.values()) {
    node.children = (byParent.get(node.user_id) ?? []).sort((a, b) =>
      a.affiliate_code.localeCompare(b.affiliate_code),
    );
  }
  if (rootId) {
    const root = byId.get(rootId);
    return root ? [root] : [];
  }
  return (byParent.get(null) ?? []).sort((a, b) =>
    a.affiliate_code.localeCompare(b.affiliate_code),
  );
}

export default function AdminReferralsPage() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const rootId = search.get('root');

  const [filterText, setFilterText] = React.useState('');

  const q = useQuery({
    queryKey: ['affiliate-promoters'],
    queryFn: fetchPromoters,
    refetchInterval: 60_000,
  });

  const trees = React.useMemo(
    () => (q.data ? buildTree(q.data, rootId) : []),
    [q.data, rootId],
  );

  const visibleTrees = React.useMemo(() => {
    if (!filterText.trim()) return trees;
    const s = filterText.trim().toLowerCase();
    function nodeMatches(n: TreeNode): boolean {
      if (
        n.affiliate_code.toLowerCase().includes(s) ||
        (n.email ? n.email.toLowerCase().includes(s) : false)
      )
        return true;
      return n.children.some(nodeMatches);
    }
    return trees.filter(nodeMatches);
  }, [trees, filterText]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/affiliates" className="text-sm text-muted-foreground hover:text-gold">
            ← Affiliates
          </Link>
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            Referrals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cây quan hệ affiliate (ltree). Click node để drill vào subtree.
          </p>
        </div>
        <Button variant="ghost" className="border border-border" onClick={() => q.refetch()}>
          Làm mới
        </Button>
      </header>

      {rootId && (
        <div className="rounded border border-gold/30 bg-gold/5 p-3 text-sm">
          Đang xem subtree của <span className="font-mono">{rootId.slice(0, 8)}…</span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-3"
            onClick={() => router.push(pathname)}
          >
            Xem toàn bộ cây
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <Input
            placeholder="Tìm mã / email…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="max-w-sm"
          />
          <div className="ml-auto text-sm text-muted-foreground">
            {visibleTrees.length} root node
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : q.error ? (
            <p className="text-sm text-red-300">{(q.error as Error).message}</p>
          ) : visibleTrees.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có node nào khớp.</p>
          ) : (
            <ul className="space-y-1">
              {visibleTrees.map((n) => (
                <TreeNodeView key={n.user_id} node={n} pathname={pathname} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TreeNodeView({ node, pathname }: { node: TreeNode; pathname: string }) {
  const [open, setOpen] = React.useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <li className="text-sm">
      <div className="flex items-center gap-2 py-1">
        {hasChildren ? (
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-5 text-center text-muted-foreground hover:text-gold"
            aria-label={open ? 'Thu gọn' : 'Mở rộng'}
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-5 text-center text-muted-foreground/40">·</span>
        )}
        <Link
          href={`${pathname}?root=${encodeURIComponent(node.user_id)}`}
          className="font-mono text-gold hover:underline"
        >
          {node.affiliate_code}
        </Link>
        <span
          className={`ml-1 rounded px-1.5 py-0.5 text-[10px] uppercase ${
            node.tier === 'platinum'
              ? 'bg-purple-500/20 text-purple-300'
              : node.tier === 'gold'
                ? 'bg-gold/20 text-gold'
                : node.tier === 'silver'
                  ? 'bg-zinc-400/20 text-zinc-300'
                  : 'bg-amber-700/20 text-amber-300'
          }`}
        >
          {node.tier}
        </span>
        <span className="text-xs text-muted-foreground">
          depth {node.depth} · subtree {node.total_subtree}
        </span>
        {node.email && (
          <span className="ml-1 text-xs text-muted-foreground/80">{node.email}</span>
        )}
      </div>
      {hasChildren && open && (
        <ul className="ml-6 border-l border-border pl-3">
          {node.children.map((c) => (
            <TreeNodeView key={c.user_id} node={c} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

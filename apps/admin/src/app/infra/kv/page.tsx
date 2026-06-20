'use client';

/**
 * Hạ tầng → Cloudflare KV — read-only browser over the operational KV
 * namespaces (SESSIONS / CACHE / AFFILIATES). Unlike the other /infra tools
 * this page is INTERACTIVE (not an InfraPanel table): the operator picks a
 * namespace + prefix (curated chip or free text), browses keys, and clicks a
 * key to read its value. Sensitive keys come back `redacted`; values >8KB come
 * back `truncated` — both surfaced as inline notices.
 *
 * Data: GET /api/admin-proxy/admin/infra/kv{,/keys,/value} → worker KV browser
 * (PR #203). We reuse the InfraPanel HEADER pattern (back link + PageHeader +
 * "Mở trang gốc") from the shared tool catalog, but render our own body.
 */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, Input, Skeleton, cn } from '@hieu-asia/ui';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  ListTree,
  Lock,
  Scissors,
  Search,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import {
  getInfraKvCatalog,
  getInfraKvKeys,
  getInfraKvValue,
  type InfraKvKeyItem,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import { JsonTree } from '@/components/admin/infra/JsonTree';
import { tryParseJson, formatBytes } from '@/components/admin/infra/json-tree-parse';

const tool = getInfraTool('kv')!;

/** KV `expiration` is a unix-seconds timestamp (or null = no TTL). */
function fmtExpiration(exp: number | null): string {
  if (exp == null) return 'không hết hạn';
  const rel = formatRelativeOrEmpty(exp * 1000);
  // future expiry reads "" from formatRelativeOrEmpty (diff < 0) → show absolute.
  if (rel) return `hết hạn ${rel}`;
  try {
    return `hết hạn ${new Date(exp * 1000).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    })}`;
  } catch {
    return 'có hạn dùng';
  }
}

/** "Còn hạn" phrasing for the value pane: time UNTIL a future expiry. */
function fmtTtlRemaining(exp: number | null): string {
  if (exp == null) return 'không hết hạn';
  const diffMs = exp * 1000 - Date.now();
  if (diffMs <= 0) return 'đã hết hạn';
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `còn ${mins} phút`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `còn ${hours} giờ`;
  const days = Math.floor(hours / 24);
  if (days < 60) return `còn ${days} ngày`;
  return `còn ${Math.floor(days / 30)} tháng`;
}

/** Render an approximate count badge: "≥1000" when not exact, else the number. */
function fmtCount(count: number | undefined, exact: boolean | undefined): string {
  if (count == null) return '?';
  if (exact === false) return `≥${count}`;
  return String(count);
}

/** Pretty-print a value: parse JSON if possible, else show raw. */
function prettyValue(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

/** A small clipboard-copy icon button with a transient "copied" check. */
function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  label: string;
  className?: string;
}): React.ReactElement {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        try {
          void navigator.clipboard?.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        } catch {
          /* clipboard unavailable — no-op */
        }
      }}
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold',
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-jade" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function InfraKvPage() {
  const { Icon } = tool;
  const [ns, setNs] = React.useState<string>('');
  const [prefix, setPrefix] = React.useState<string>('');
  const [prefixInput, setPrefixInput] = React.useState<string>('');
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  // Accumulated key pages (chip/ns click resets; "Tải thêm" appends).
  const [items, setItems] = React.useState<InfraKvKeyItem[]>([]);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [listComplete, setListComplete] = React.useState<boolean>(true);
  const [pageCursor, setPageCursor] = React.useState<string | null>(null);
  // Server-side substring search within the active (ns, prefix).
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [contains, setContains] = React.useState<string>('');
  // Direct exact-key lookup (jumps to the value pane without paging).
  const [lookupInput, setLookupInput] = React.useState<string>('');
  // Value pane: JSON-tree vs raw <pre> toggle (default tree when parseable).
  const [rawView, setRawView] = React.useState<boolean>(false);

  const catalog = useQuery({
    queryKey: ['infra', 'kv', 'catalog'],
    queryFn: getInfraKvCatalog,
    staleTime: 60_000,
  });

  const keysQuery = useQuery({
    queryKey: ['infra', 'kv', 'keys', ns, prefix, pageCursor, contains],
    queryFn: () => getInfraKvKeys(ns, prefix, pageCursor, contains || undefined),
    enabled: ns !== '',
    staleTime: 15_000,
  });

  // Fold each loaded page into the accumulated list. A fresh (ns,prefix,search)
  // sends pageCursor=null → replace; a "Tải thêm" sends a cursor → append.
  // (Search mode is single-shot, so pageCursor is always null there.)
  React.useEffect(() => {
    const data = keysQuery.data;
    if (!data || !data.ok) return;
    const incoming = data.items ?? [];
    setItems((prev) => (pageCursor ? [...prev, ...incoming] : incoming));
    setCursor(data.cursor ?? null);
    setListComplete(data.list_complete ?? true);
  }, [keysQuery.data, pageCursor]);

  const valueQuery = useQuery({
    queryKey: ['infra', 'kv', 'value', ns, selectedKey],
    queryFn: () => getInfraKvValue(ns, selectedKey as string),
    enabled: ns !== '' && selectedKey != null,
    staleTime: 15_000,
  });

  // Whenever a new key is selected, default back to the tree view.
  React.useEffect(() => {
    setRawView(false);
  }, [selectedKey]);

  function loadList(nextNs: string, nextPrefix: string) {
    setNs(nextNs);
    setPrefix(nextPrefix);
    setPrefixInput(nextPrefix);
    setSelectedKey(null);
    setItems([]);
    setCursor(null);
    setListComplete(true);
    setPageCursor(null);
    setSearchInput('');
    setContains('');
  }

  /** Run a substring search within the current (ns, prefix). */
  function runSearch(term: string) {
    setSelectedKey(null);
    setItems([]);
    setCursor(null);
    setListComplete(true);
    setPageCursor(null);
    setContains(term.trim());
  }

  /** Jump straight to a value by exact key (no paging needed). */
  function lookupKey(key: string) {
    const k = key.trim();
    if (!ns || !k) return;
    setSelectedKey(k);
  }

  const namespaces = catalog.data?.ok ? (catalog.data.namespaces ?? []) : [];
  const chips = catalog.data?.ok ? (catalog.data.chips ?? []) : [];
  const catalogError =
    catalog.isError ||
    (catalog.data && !catalog.data.ok ? catalog.data.error || 'Không tải được KV.' : undefined);

  const header = (
    <PageHeader
      icon={<Icon className="h-5 w-5" />}
      title={tool.name}
      description={tool.blurb}
      actions={
        <a href={tool.external} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Mở trang gốc
          </Button>
        </a>
      }
    />
  );

  const backLink = (
    <Link
      href="/infra"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Hạ tầng
    </Link>
  );

  return (
    <div className="space-y-6">
      {backLink}
      {header}

      {catalog.isLoading ? (
        <Card>
          <CardContent className="space-y-2 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : catalogError ? (
        <ErrorBlock
          title="Không tải được Cloudflare KV"
          message={typeof catalogError === 'string' ? catalogError : 'Không tải được KV.'}
          onRetry={() => catalog.refetch()}
        />
      ) : (
        <>
          {/* Namespace + prefix picker */}
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Vùng dữ liệu
                </p>
                <div className="flex flex-wrap gap-2">
                  {namespaces.map((n) => (
                    <button
                      key={n.binding}
                      type="button"
                      onClick={() => loadList(n.binding, '')}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        ns === n.binding
                          ? 'border-gold/40 bg-gold/15 text-gold'
                          : 'border-border bg-muted/40 text-muted-foreground hover:border-gold/30 hover:text-foreground',
                      )}
                    >
                      {n.binding}
                      <span
                        className="rounded-full bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px] leading-none text-foreground/70"
                        title={n.exact === false ? 'ước lượng (≥1000)' : 'số key'}
                      >
                        {fmtCount(n.count, n.exact)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {chips.length > 0 && (
                <div className="space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Lối tắt
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chips.map((c) => {
                      const active = ns === c.ns && prefix === c.prefix;
                      return (
                        <button
                          key={`${c.ns}:${c.prefix}:${c.label}`}
                          type="button"
                          onClick={() => loadList(c.ns, c.prefix)}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors',
                            active
                              ? 'border-jade/40 bg-jade/10 text-jade'
                              : 'border-border bg-muted/40 text-muted-foreground hover:border-jade/30 hover:text-foreground',
                          )}
                          title={`${c.ns} · ${c.prefix}`}
                        >
                          {c.label}
                          <span
                            className="rounded-full bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px] leading-none text-foreground/70"
                            title={c.exact === false ? 'ước lượng (≥1000)' : 'số key'}
                          >
                            {fmtCount(c.count, c.exact)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Tiền tố tự nhập
                  </p>
                  <form
                    className="flex flex-wrap items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (ns) loadList(ns, prefixInput.trim());
                    }}
                  >
                    <Input
                      value={prefixInput}
                      onChange={(e) => setPrefixInput(e.target.value)}
                      placeholder={ns ? 'vd: session:unlocked:' : 'Chọn vùng dữ liệu trước'}
                      disabled={!ns}
                      className="max-w-xs font-mono text-xs"
                    />
                    <Button type="submit" size="sm" variant="outline" disabled={!ns}>
                      Lọc
                    </Button>
                  </form>
                </div>

                <div className="space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Tra cứu key chính xác
                  </p>
                  <form
                    className="flex flex-wrap items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      lookupKey(lookupInput);
                    }}
                  >
                    <Input
                      value={lookupInput}
                      onChange={(e) => setLookupInput(e.target.value)}
                      placeholder={ns ? 'vd: streak:HA-12345' : 'Chọn vùng dữ liệu trước'}
                      disabled={!ns}
                      className="max-w-xs font-mono text-xs"
                    />
                    <Button type="submit" size="sm" variant="outline" disabled={!ns || !lookupInput.trim()}>
                      Mở
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key list + value detail */}
          {ns === '' ? (
            <EmptyState
              title="Chọn vùng dữ liệu để bắt đầu"
              description="Bấm một vùng (SESSIONS / CACHE / AFFILIATES) hoặc một lối tắt ở trên để xem danh sách key."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              {/* Key list */}
              <Card className="min-w-0">
                <CardContent className="p-0">
                  <div className="space-y-2 border-b border-border px-4 py-2.5">
                    <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <span className="text-foreground">{ns}</span>
                      {prefix && <span className="text-gold"> · {prefix}</span>}
                    </p>
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        runSearch(searchInput);
                      }}
                    >
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          placeholder="Tìm trong tên key…"
                          className="h-8 pl-8 font-mono text-xs"
                        />
                      </div>
                      <Button type="submit" size="sm" variant="outline" className="h-8">
                        Tìm
                      </Button>
                      {contains && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8"
                          onClick={() => runSearch('')}
                        >
                          Xoá
                        </Button>
                      )}
                    </form>
                    {contains && keysQuery.data?.ok && (
                      <p className="text-[11px] text-muted-foreground">
                        Kết quả cho “<span className="text-foreground">{contains}</span>”: {items.length} key
                        {typeof keysQuery.data.scanned === 'number' && (
                          <> · đã quét {keysQuery.data.scanned}</>
                        )}
                        {keysQuery.data.scan_truncated && (
                          <span className="text-gold"> · dừng ở ~1000 (còn nữa)</span>
                        )}
                      </p>
                    )}
                  </div>
                  {keysQuery.isLoading && items.length === 0 ? (
                    <div className="space-y-2 p-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-full" />
                      ))}
                    </div>
                  ) : keysQuery.isError ||
                    (keysQuery.data && !keysQuery.data.ok) ? (
                    <div className="p-4">
                      <ErrorBlock
                        compact
                        message={
                          (keysQuery.data && !keysQuery.data.ok && keysQuery.data.error) ||
                          'Không tải được danh sách key.'
                        }
                        onRetry={() => keysQuery.refetch()}
                      />
                    </div>
                  ) : items.length === 0 ? (
                    <div className="p-4">
                      <EmptyState
                        title="Không có key nào"
                        description="Vùng/tiền tố này hiện chưa có key."
                      />
                    </div>
                  ) : (
                    <>
                      <ul className="divide-y divide-border/50">
                        {items.map((it) => {
                          const active = selectedKey === it.name;
                          return (
                            <li
                              key={it.name}
                              className={cn(
                                'group flex items-center gap-1 pr-2 transition-colors',
                                active ? 'bg-gold/10' : 'hover:bg-gold/5',
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedKey(it.name)}
                                className="flex min-w-0 flex-1 flex-col items-start gap-0.5 px-4 py-2.5 text-left"
                              >
                                <span className="w-full truncate font-mono text-xs text-foreground">
                                  {it.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {fmtExpiration(it.expiration)}
                                </span>
                              </button>
                              <CopyButton
                                text={it.name}
                                label="Sao chép key"
                                className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                              />
                            </li>
                          );
                        })}
                      </ul>
                      {!listComplete && (
                        <div className="border-t border-border p-3 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={keysQuery.isFetching}
                            onClick={() => setPageCursor(cursor)}
                          >
                            {keysQuery.isFetching ? 'Đang tải…' : 'Tải thêm'}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Value detail */}
              <Card className="min-w-0">
                <CardContent className="p-4">
                  {selectedKey == null ? (
                    <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                      <KeyRound className="h-8 w-8 text-gold/40" />
                      <p className="text-sm">Bấm một key để xem nội dung.</p>
                    </div>
                  ) : valueQuery.isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : valueQuery.isError ||
                    (valueQuery.data && !valueQuery.data.ok) ? (
                    <ErrorBlock
                      compact
                      message={
                        (valueQuery.data && !valueQuery.data.ok && valueQuery.data.error) ||
                        'Không đọc được nội dung key.'
                      }
                      onRetry={() => valueQuery.refetch()}
                    />
                  ) : (
                    valueQuery.data &&
                    valueQuery.data.ok &&
                    (() => {
                      const data = valueQuery.data;
                      const rawVal = data.value;
                      const parsed = rawVal != null ? tryParseJson(rawVal) : { ok: false as const };
                      const showTree = parsed.ok && !rawView;
                      return (
                        <div className="space-y-3">
                          <div className="space-y-0.5">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                              Key
                            </p>
                            <div className="flex items-start gap-1.5">
                              <p className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                                {selectedKey}
                              </p>
                              {selectedKey && (
                                <CopyButton text={selectedKey} label="Sao chép key" />
                              )}
                            </div>
                          </div>

                          {data.not_found ? (
                            <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                              không tìm thấy
                            </div>
                          ) : (
                            <>
                              {/* Size + TTL summary line */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                                {!data.redacted && typeof data.bytes === 'number' && (
                                  <span>
                                    Kích thước:{' '}
                                    <span className="text-foreground">{formatBytes(data.bytes)}</span>
                                  </span>
                                )}
                                <span>
                                  Còn hạn:{' '}
                                  <span className="text-foreground">
                                    {fmtTtlRemaining(data.expiration ?? null)}
                                  </span>
                                </span>
                              </div>

                              {data.redacted && (
                                <div className="flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold">
                                  <Lock className="h-3.5 w-3.5" />
                                  🔒 đã ẩn (key nhạy cảm)
                                </div>
                              )}
                              {data.truncated && (
                                <div className="flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold">
                                  <Scissors className="h-3.5 w-3.5" />
                                  ⚠️ đã cắt bớt (&gt;8KB)
                                </div>
                              )}

                              {rawVal != null ? (
                                <div className="space-y-2">
                                  {/* Toolbar: tree/raw toggle + copy value */}
                                  <div className="flex items-center justify-between gap-2">
                                    {parsed.ok ? (
                                      <button
                                        type="button"
                                        onClick={() => setRawView((r) => !r)}
                                        className="inline-flex items-center gap-1.5 rounded border border-border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                                      >
                                        <ListTree className="h-3.5 w-3.5" />
                                        {rawView ? 'Xem dạng cây' : 'Xem dạng thô'}
                                      </button>
                                    ) : (
                                      <span />
                                    )}
                                    <CopyButton text={rawVal} label="Sao chép nội dung" />
                                  </div>

                                  {showTree ? (
                                    <JsonTree value={parsed.value} />
                                  ) : (
                                    <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/30 p-3 font-mono text-xs text-foreground">
                                      {prettyValue(rawVal)}
                                    </pre>
                                  )}
                                </div>
                              ) : (
                                !data.redacted && (
                                  <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                                    (rỗng)
                                  </div>
                                )
                              )}

                              {data.metadata && Object.keys(data.metadata).length > 0 && (
                                <div className="space-y-1">
                                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                    Metadata
                                  </p>
                                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-3 font-mono text-xs text-muted-foreground">
                                    {JSON.stringify(data.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })()
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

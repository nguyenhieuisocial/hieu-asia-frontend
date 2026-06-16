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
import { ArrowLeft, ExternalLink, KeyRound, Lock, Scissors } from 'lucide-react';
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

/** Pretty-print a value: parse JSON if possible, else show raw. */
function prettyValue(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
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

  const catalog = useQuery({
    queryKey: ['infra', 'kv', 'catalog'],
    queryFn: getInfraKvCatalog,
    staleTime: 60_000,
  });

  const keysQuery = useQuery({
    queryKey: ['infra', 'kv', 'keys', ns, prefix, pageCursor],
    queryFn: () => getInfraKvKeys(ns, prefix, pageCursor),
    enabled: ns !== '',
    staleTime: 15_000,
  });

  // Fold each loaded page into the accumulated list. A fresh (ns,prefix) sends
  // pageCursor=null → replace; a "Tải thêm" sends a cursor → append.
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

  function loadList(nextNs: string, nextPrefix: string) {
    setNs(nextNs);
    setPrefix(nextPrefix);
    setPrefixInput(nextPrefix);
    setSelectedKey(null);
    setItems([]);
    setCursor(null);
    setListComplete(true);
    setPageCursor(null);
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
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        ns === n.binding
                          ? 'border-gold/40 bg-gold/15 text-gold'
                          : 'border-border bg-muted/40 text-muted-foreground hover:border-gold/30 hover:text-foreground',
                      )}
                    >
                      {n.binding}
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
                            'rounded-full border px-3 py-1 text-xs transition-colors',
                            active
                              ? 'border-jade/40 bg-jade/10 text-jade'
                              : 'border-border bg-muted/40 text-muted-foreground hover:border-jade/30 hover:text-foreground',
                          )}
                          title={`${c.ns} · ${c.prefix}`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  <div className="border-b border-border px-4 py-2.5">
                    <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      <span className="text-foreground">{ns}</span>
                      {prefix && <span className="text-gold"> · {prefix}</span>}
                    </p>
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
                            <li key={it.name}>
                              <button
                                type="button"
                                onClick={() => setSelectedKey(it.name)}
                                className={cn(
                                  'flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors',
                                  active ? 'bg-gold/10' : 'hover:bg-gold/5',
                                )}
                              >
                                <span className="w-full truncate font-mono text-xs text-foreground">
                                  {it.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {fmtExpiration(it.expiration)}
                                </span>
                              </button>
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
                    valueQuery.data.ok && (
                      <div className="space-y-3">
                        <div className="space-y-0.5">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            Key
                          </p>
                          <p className="break-all font-mono text-xs text-foreground">
                            {selectedKey}
                          </p>
                        </div>

                        {valueQuery.data.not_found ? (
                          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                            không tìm thấy
                          </div>
                        ) : (
                          <>
                            {valueQuery.data.redacted && (
                              <div className="flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold">
                                <Lock className="h-3.5 w-3.5" />
                                🔒 đã ẩn (key nhạy cảm)
                              </div>
                            )}
                            {valueQuery.data.truncated && (
                              <div className="flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold">
                                <Scissors className="h-3.5 w-3.5" />
                                ⚠️ đã cắt bớt (&gt;8KB)
                              </div>
                            )}
                            {valueQuery.data.value != null ? (
                              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/30 p-3 font-mono text-xs text-foreground">
                                {prettyValue(valueQuery.data.value)}
                              </pre>
                            ) : (
                              !valueQuery.data.redacted && (
                                <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                                  (rỗng)
                                </div>
                              )
                            )}

                            {valueQuery.data.metadata &&
                              Object.keys(valueQuery.data.metadata).length > 0 && (
                                <div className="space-y-1">
                                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                    Metadata
                                  </p>
                                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-3 font-mono text-xs text-muted-foreground">
                                    {JSON.stringify(valueQuery.data.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    )
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

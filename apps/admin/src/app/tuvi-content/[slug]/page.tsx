'use client';

/**
 * /tuvi-content/[slug] — màn hình SỬA nội dung Tử Vi cho founder (không cần code).
 *
 * THIẾT KẾ — vì sao khai báo trường theo bảng thay vì viết form tay cho từng loại:
 * `data` là jsonb với 2 hình dạng (cung: 8 trường · sao: 6 trường), trong đó có
 * mảng chuỗi và mảng đối tượng. Khai báo `FIELDS` rồi render bằng 1 bộ điều khiển
 * dùng chung → thêm trường mới sau này chỉ cần thêm 1 dòng, không phải sửa JSX.
 *
 * CHỐNG MẤT DỮ LIỆU (3 lớp):
 *   1. API `PUT` MERGE với bản hiện tại (xem route.ts) — trường form không biết
 *      vẫn được giữ nguyên.
 *   2. Form nạp giá trị từ bản đã lưu; chỉ gửi các trường đã khai báo.
 *   3. Trường có trong DB mà form chưa hỗ trợ được LIỆT KÊ RÕ cho founder thấy
 *      là "giữ nguyên, không sửa được ở đây" — thà nói thật hơn để nó âm thầm.
 */

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Label, Textarea } from '@hieu-asia/ui';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ErrorBlock } from '@/components/admin/error-block';

type Kind = 'palace' | 'star';

interface Item {
  slug: string;
  kind: Kind;
  title: string;
  data: Record<string, unknown>;
  updated_at: string | null;
}

type Field =
  | { key: string; label: string; type: 'text' | 'long'; hint?: string }
  | { key: string; label: string; type: 'list'; hint?: string; itemLabel: string }
  | {
      key: string;
      label: string;
      type: 'pairs';
      hint?: string;
      a: { key: string; label: string; options?: string[] };
      b: { key: string; label: string };
    };

/** Khai báo trường theo `kind` — khớp đúng shape trong apps/web/src/lib/tuvi-content.ts */
const FIELDS: Record<Kind, Field[]> = {
  palace: [
    { key: 'fullName', label: 'Tên đầy đủ', type: 'text', hint: 'VD: Cung Mệnh (命宮)' },
    { key: 'domain', label: 'Lĩnh vực', type: 'text', hint: 'Một cụm ngắn, VD: Bản chất cốt lõi' },
    { key: 'overview', label: 'Giới thiệu chung', type: 'long', hint: 'Đoạn mở đầu khách đọc trước tiên' },
    { key: 'whatItRepresents', label: 'Cung này nói về điều gì', type: 'list', itemLabel: 'Ý' },
    { key: 'howToRead', label: 'Cách đọc', type: 'list', itemLabel: 'Bước' },
    { key: 'trigon', label: 'Tam phương tứ chính', type: 'list', itemLabel: 'Cung' },
    { key: 'commonStars', label: 'Sao thường gặp', type: 'list', itemLabel: 'Sao' },
    {
      key: 'faq',
      label: 'Câu hỏi thường gặp',
      type: 'pairs',
      a: { key: 'q', label: 'Câu hỏi' },
      b: { key: 'a', label: 'Trả lời' },
    },
  ],
  star: [
    { key: 'archetype', label: 'Bản chất sao', type: 'long', hint: 'Câu mô tả cốt lõi — cũng dùng cho mô tả SEO' },
    { key: 'positive', label: 'Điểm mạnh', type: 'list', itemLabel: 'Điểm mạnh' },
    { key: 'caution', label: 'Điểm cần chú ý', type: 'list', itemLabel: 'Lưu ý' },
    {
      key: 'byPalace',
      label: 'Sao này tại từng cung',
      type: 'pairs',
      a: { key: 'palace', label: 'Cung' },
      b: { key: 'reading', label: 'Diễn giải' },
    },
    {
      key: 'withMutagen',
      label: 'Khi gặp tứ hoá',
      type: 'pairs',
      a: { key: 'type', label: 'Hoá', options: ['Lộc', 'Quyền', 'Khoa', 'Kỵ'] },
      b: { key: 'reading', label: 'Diễn giải' },
    },
  ],
};

/** `category` (major/aux) KHÔNG cho sửa: nó quyết định nhóm hiển thị + thứ tự
 *  trên web, đổi nhầm là lệch cấu trúc trang. Muốn đổi thì sửa ở code. */
const READONLY_KEYS = new Set(['category']);

const asList = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x ?? '')) : []);
const asPairs = (v: unknown): Record<string, string>[] =>
  Array.isArray(v)
    ? v.map((x) => (x && typeof x === 'object' ? (x as Record<string, string>) : {}))
    : [];

export default function TuviContentEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['admin', 'tuvi-content', slug],
    queryFn: async () => {
      const r = await fetch(`/api/admin/tuvi-content/${slug}`, { cache: 'no-store' });
      const j = (await r.json()) as { ok?: boolean; item?: Item; error?: string };
      if (!r.ok || !j.ok || !j.item) throw new Error(j.error ?? `HTTP ${r.status}`);
      return j.item;
    },
  });

  const [title, setTitle] = React.useState('');
  const [form, setForm] = React.useState<Record<string, unknown>>({});
  const [dirty, setDirty] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  // Nạp form 1 lần khi có dữ liệu (không ghi đè khi founder đang sửa).
  React.useEffect(() => {
    if (!item || dirty) return;
    setTitle(item.title);
    setForm({ ...(item.data ?? {}) });
  }, [item, dirty]);

  const fields = item ? FIELDS[item.kind] : [];
  const knownKeys = new Set([...fields.map((f) => f.key), ...READONLY_KEYS]);
  const preserved = Object.keys(item?.data ?? {}).filter((k) => !knownKeys.has(k));

  const set = (key: string, value: unknown) => {
    setDirty(true);
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = useMutation({
    mutationFn: async () => {
      // Chỉ gửi các trường form quản lý; API merge nên trường khác không mất.
      const payload: Record<string, unknown> = {};
      for (const f of fields) payload[f.key] = form[f.key] ?? (f.type === 'text' || f.type === 'long' ? '' : []);
      const r = await fetch(`/api/admin/tuvi-content/${slug}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title, data: payload }),
      });
      const j = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !j.ok) throw new Error(j.error ?? `HTTP ${r.status}`);
    },
    onSuccess: async () => {
      setDirty(false);
      setSaved(true);
      await qc.invalidateQueries({ queryKey: ['admin', 'tuvi-content'] });
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Đang tải…</p>;
  if (error) return <ErrorBlock message={(error as Error).message} onRetry={() => router.refresh()} />;
  if (!item) return null;

  return (
    <div className="space-y-6 pb-16">
      <div>
        <Link
          href="/tuvi-content"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Về danh sách
        </Link>
        <PageHeader
          title={`Sửa: ${item.title}`}
          description={`${item.kind === 'palace' ? 'Cung' : 'Sao'} · ${item.slug}${
            item.updated_at ? ` · sửa lần cuối ${new Date(item.updated_at).toLocaleString('vi-VN')}` : ''
          }`}
        />
      </div>

      {save.error && <ErrorBlock title="Lưu không thành công" message={(save.error as Error).message} />}
      {saved && !dirty && (
        <p className="rounded-md border border-jade/40 bg-jade/[0.06] px-3 py-2 text-sm">
          Đã lưu. Website sẽ hiển thị nội dung mới sau vài phút.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Tên hiển thị</Label>
        <Input id="title" value={title} onChange={(e) => { setDirty(true); setSaved(false); setTitle(e.target.value); }} />
      </div>

      {fields.map((f) => (
        <div key={f.key} className="space-y-2 rounded-lg border border-border p-4">
          <Label htmlFor={f.key}>{f.label}</Label>
          {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}

          {f.type === 'text' && (
            <Input id={f.key} value={String(form[f.key] ?? '')} onChange={(e) => set(f.key, e.target.value)} />
          )}

          {f.type === 'long' && (
            <Textarea
              id={f.key}
              rows={4}
              value={String(form[f.key] ?? '')}
              onChange={(e) => set(f.key, e.target.value)}
            />
          )}

          {f.type === 'list' && (
            <ListEditor
              items={asList(form[f.key])}
              itemLabel={f.itemLabel}
              onChange={(next) => set(f.key, next)}
            />
          )}

          {f.type === 'pairs' && (
            <PairsEditor
              items={asPairs(form[f.key])}
              a={f.a}
              b={f.b}
              onChange={(next) => set(f.key, next)}
            />
          )}
        </div>
      ))}

      {preserved.length > 0 && (
        <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Các phần sau có trong dữ liệu nhưng <b>không sửa được ở đây</b> — chúng được{' '}
          <b>giữ nguyên</b> khi bạn lưu: {preserved.join(', ')}.
        </p>
      )}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-lg border border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Button onClick={() => save.mutate()} disabled={!dirty || save.isPending}>
          <Save className="mr-2 h-4 w-4" aria-hidden />
          {save.isPending ? 'Đang lưu…' : 'Lưu'}
        </Button>
        {dirty && <span className="text-sm text-muted-foreground">Có thay đổi chưa lưu</span>}
      </div>
    </div>
  );
}

/** Mảng chuỗi: thêm / sửa / xoá / đổi thứ tự đơn giản. */
function ListEditor({
  items,
  itemLabel,
  onChange,
}: {
  items: string[];
  itemLabel: string;
  onChange: (next: string[]) => void;
}) {
  const upd = (i: number, v: string) => onChange(items.map((x, k) => (k === i ? v : x)));
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 w-6 shrink-0 text-right text-xs text-muted-foreground">{i + 1}.</span>
          <Textarea rows={2} value={v} onChange={(e) => upd(i, e.target.value)} aria-label={`${itemLabel} ${i + 1}`} />
          <Button
            variant="outline"
            size="sm"
            className="mt-1 shrink-0"
            onClick={() => onChange(items.filter((_, k) => k !== i))}
            aria-label={`Xoá ${itemLabel} ${i + 1}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
        <Plus className="mr-1 h-4 w-4" aria-hidden /> Thêm {itemLabel.toLowerCase()}
      </Button>
    </div>
  );
}

/** Mảng đối tượng 2 trường (câu hỏi/trả lời · cung/diễn giải · hoá/diễn giải). */
function PairsEditor({
  items,
  a,
  b,
  onChange,
}: {
  items: Record<string, string>[];
  a: { key: string; label: string; options?: string[] };
  b: { key: string; label: string };
  onChange: (next: Record<string, string>[]) => void;
}) {
  const upd = (i: number, key: string, v: string) =>
    onChange(items.map((x, k) => (k === i ? { ...x, [key]: v } : x)));
  return (
    <div className="space-y-3">
      {items.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/70 p-3">
          <div className="flex items-center gap-2">
            {a.options ? (
              <select
                className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                value={row[a.key] ?? ''}
                onChange={(e) => upd(i, a.key, e.target.value)}
                aria-label={`${a.label} ${i + 1}`}
              >
                <option value="">— chọn —</option>
                {a.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                value={row[a.key] ?? ''}
                onChange={(e) => upd(i, a.key, e.target.value)}
                placeholder={a.label}
                aria-label={`${a.label} ${i + 1}`}
              />
            )}
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => onChange(items.filter((_, k) => k !== i))}
              aria-label={`Xoá mục ${i + 1}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          <Textarea
            rows={3}
            value={row[b.key] ?? ''}
            onChange={(e) => upd(i, b.key, e.target.value)}
            placeholder={b.label}
            aria-label={`${b.label} ${i + 1}`}
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, { [a.key]: '', [b.key]: '' }])}>
        <Plus className="mr-1 h-4 w-4" aria-hidden /> Thêm mục
      </Button>
    </div>
  );
}

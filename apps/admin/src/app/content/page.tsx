'use client';

/**
 * /admin/content — Wave 60.98 multi-LLM content list.
 *
 * Tabs: Newsletter | Pillar
 * Filter: status (all/draft/in_review/published/archived)
 * Top actions:
 *   - "Tạo nội dung mới" → dialog (type + topic + slug?)
 *   - "Tạo loạt 10 SEO pillar" → bulk-generate all 10 audience routes (background)
 *
 * Table columns: topic, status pill, judge_pick, created_at, actions.
 */

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  StatusBadge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
  toast,
} from '@hieu-asia/ui';
import { FileText, Plus, Layers, ChevronRight, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import {
  useContentDrafts,
  useGenerateContent,
  useBulkGeneratePillars,
  type ContentType,
  type ContentStatus,
  type ContentDraftListRow,
  type DraftKey,
} from '@/hooks/useContentDrafts';

const STATUS_FILTERS: Array<{ value: 'all' | ContentStatus; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'Đang review' },
  { value: 'published', label: 'Đã publish' },
  { value: 'archived', label: 'Đã lưu trữ' },
];

const STATUS_TONE: Record<ContentStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  draft: 'neutral',
  in_review: 'warning',
  published: 'success',
  archived: 'info',
};

const JUDGE_LABEL: Record<DraftKey, string> = {
  claude: 'Claude',
  openai: 'GPT',
  google: 'Gemini',
};

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function ContentListPage() {
  const [tab, setTab] = React.useState<ContentType>('newsletter');
  const [status, setStatus] = React.useState<'all' | ContentStatus>('all');

  const filter = React.useMemo(
    () => ({
      type: tab,
      status: status === 'all' ? undefined : status,
      limit: 100,
    }),
    [tab, status],
  );
  const { data, isLoading, error } = useContentDrafts(filter);

  const rows = data?.drafts ?? [];
  const note = data?.note;
  const errMsg = (error as Error | undefined)?.message ?? (data?.ok === false ? data.error : null);

  // ---- Create modal ---------------------------------------------------------
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createType, setCreateType] = React.useState<ContentType>('newsletter');
  const [createTopic, setCreateTopic] = React.useState('');
  const [createSlug, setCreateSlug] = React.useState('');

  const generateMut = useGenerateContent();
  const bulkMut = useBulkGeneratePillars();

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createTopic.trim()) {
      toast.error('Chủ đề bắt buộc');
      return;
    }
    if (createType === 'pillar' && !createSlug.trim()) {
      toast.error('Pillar cần slug');
      return;
    }
    generateMut.mutate(
      {
        type: createType,
        topic: createTopic.trim(),
        slug: createType === 'pillar' ? createSlug.trim() : undefined,
      },
      {
        onSuccess: (res) => {
          if (res.ok) {
            toast.success('Đã tạo draft', { description: `Judge pick: ${JUDGE_LABEL[res.judge_pick ?? 'claude']}` });
            setCreateOpen(false);
            setCreateTopic('');
            setCreateSlug('');
          } else if (res.timedOut) {
            // #47 — generation outran the 25s edge proxy. Not a failure; the
            // worker keeps generating. Point the user to reload the list.
            toast.info('Đang sinh nội dung', { description: res.error });
            setCreateOpen(false);
            setCreateTopic('');
            setCreateSlug('');
          } else {
            toast.error('Tạo draft thất bại', { description: res.error });
          }
        },
        onError: (e) => toast.error('Tạo draft thất bại', { description: (e as Error).message }),
      },
    );
  }

  function onBulkGenerate() {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(
        'Tạo loạt 10 SEO pillar (tu-vi, bat-tu, mbti, than-so-hoc, ...). Chạy ngầm 5-10 phút. Tiếp tục?',
      )
    )
      return;
    bulkMut.mutate(undefined, {
      onSuccess: (res) => {
        if (res.ok) {
          toast.success(`Đã queue ${res.queued ?? 10} pillar`, {
            description:
              'Chạy ngầm ~5-10 phút. Tải lại danh sách để xem tiến độ. Nếu sau 10 phút vẫn rỗng → kiểm tra LLM keys (Anthropic/OpenAI/Google) + Supabase trên Worker.',
          });
        } else if (res.timedOut) {
          // #47 — bulk outran the edge proxy. Generation continues server-side.
          toast.info('Đang sinh loạt pillar', { description: res.error });
        } else {
          toast.error('Bulk generate thất bại', { description: res.error });
        }
      },
      onError: (e) => toast.error('Bulk generate thất bại', { description: (e as Error).message }),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nội dung"
        description="Newsletter tuần + SEO pillar (10 audience routes) — sinh bởi 3 LLM song song, judge model chọn bản tốt nhất."
        icon={<FileText className="h-5 w-5" />}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={onBulkGenerate}
              disabled={bulkMut.isPending}
            >
              <Layers className="mr-2 h-4 w-4" />
              {bulkMut.isPending ? 'Đang queue...' : 'Tạo loạt 10 SEO pillar'}
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo nội dung mới
            </Button>
          </>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ContentType)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="pillar">SEO Pillar</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatus(s.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs transition-colors',
                status === s.value
                  ? 'border-gold/40 bg-gold/15 text-gold'
                  : 'border-border bg-card text-muted-foreground hover:border-gold/20 hover:text-foreground',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <TabsContent value={tab} className="space-y-3">
          {errMsg && <ErrorBlock title="Lỗi tải nội dung" message={errMsg} />}
          {note && (
            <Card>
              <CardContent className="py-4 text-sm text-muted-foreground">{note}</CardContent>
            </Card>
          )}
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Đang tải...
              </CardContent>
            </Card>
          ) : rows.length === 0 ? (
            <EmptyState
              title="Chưa có nội dung nào"
              description={
                tab === 'newsletter'
                  ? 'Newsletter sẽ tự sinh mỗi Thứ Hai 08:00 VN, hoặc bấm "Tạo nội dung mới".'
                  : 'Bấm "Tạo loạt 10 SEO pillar" để sinh cho tất cả audience routes, hoặc tạo từng pillar.'
              }
              illustration={<Sparkles className="h-12 w-12 text-gold" />}
              action={
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  Tạo nội dung mới
                </Button>
              }
            />
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Chủ đề</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Judge chọn</th>
                      <th className="px-4 py-3">Tạo lúc</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((row) => (
                      <Row key={row.id} row={row} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo nội dung mới</DialogTitle>
            <DialogDescription>
              3 LLM (Claude Opus 4.7 + GPT-5.5 + Gemini) sẽ chạy song song. Judge sẽ chấm + chọn bản tốt nhất.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onCreate} className="space-y-4">
            <div>
              <Label>Loại nội dung</Label>
              <div className="mt-2 flex gap-2">
                {(['newsletter', 'pillar'] as ContentType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCreateType(t)}
                    className={cn(
                      'rounded-md border px-3 py-2 text-sm transition-colors',
                      createType === t
                        ? 'border-gold/40 bg-gold/15 text-gold'
                        : 'border-border bg-card text-muted-foreground hover:border-gold/20 hover:text-foreground',
                    )}
                  >
                    {t === 'newsletter' ? 'Newsletter' : 'SEO Pillar'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="topic">Chủ đề</Label>
              <Input
                id="topic"
                value={createTopic}
                onChange={(e) => setCreateTopic(e.target.value)}
                placeholder={
                  createType === 'newsletter'
                    ? 'Vd: Tử Vi tuần này 27/05'
                    : 'Vd: Tử Vi cho người Việt hiện đại'
                }
                required
              />
            </div>
            {createType === 'pillar' && (
              <div>
                <Label htmlFor="slug">Slug (kebab-case)</Label>
                <Input
                  id="slug"
                  value={createSlug}
                  onChange={(e) => setCreateSlug(e.target.value)}
                  placeholder="vd: tu-vi-2026"
                />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={generateMut.isPending}>
                Huỷ
              </Button>
              <Button type="submit" disabled={generateMut.isPending}>
                {generateMut.isPending ? 'Đang sinh...' : 'Bắt đầu sinh'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ row }: { row: ContentDraftListRow }) {
  return (
    <tr className="text-sm hover:bg-gold/5">
      <td className="px-4 py-3">
        <Link href={`/content/${row.id}`} className="text-foreground hover:text-gold">
          {row.topic}
        </Link>
        {row.slug && (
          <div className="font-mono text-[10px] text-muted-foreground">/{row.slug}</div>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={STATUS_TONE[row.status]} label={row.status} />
      </td>
      <td className="px-4 py-3 text-muted-foreground">{JUDGE_LABEL[row.judge_pick]}</td>
      <td className="px-4 py-3 text-muted-foreground">{fmtDate(row.created_at)}</td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/content/${row.id}`}
          className="inline-flex items-center gap-1 text-xs text-gold hover:underline"
        >
          Xem
          <ChevronRight className="h-3 w-3" />
        </Link>
      </td>
    </tr>
  );
}

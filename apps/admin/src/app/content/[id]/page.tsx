'use client';

/**
 * /admin/content/[id] — Wave 60.98 multi-LLM content detail / edit view.
 *
 * Layout:
 *   - Top: PageHeader with topic, status pill, judge pick highlight.
 *   - Side-by-side tabs: Claude · GPT · Gemini · Edited
 *     Each draft column shows full markdown + judge score breakdown.
 *   - Bottom: actions:
 *     - Save edited draft
 *     - Mark for review
 *     - Publish (newsletter → Resend Broadcast; pillar → KV write)
 *
 * Publish is gated on edited_content being non-empty AND status not already
 * `published`.
 */

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatusBadge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  cn,
  toast,
} from '@hieu-asia/ui';
import { ChevronLeft, Save, Send, Archive, RotateCcw } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ErrorBlock } from '@/components/admin/error-block';
import {
  useContentDraft,
  usePatchContent,
  type ContentStatus,
  type DraftKey,
} from '@/hooks/useContentDrafts';

const JUDGE_LABEL: Record<DraftKey, string> = {
  claude: 'Claude Opus 4.7',
  openai: 'GPT-5.5',
  google: 'Gemini',
};

const STATUS_TONE: Record<ContentStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  draft: 'neutral',
  in_review: 'warning',
  published: 'success',
  archived: 'info',
};

type TabKey = DraftKey | 'edited';

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;

  const { data, isLoading, error } = useContentDraft(id);
  const patchMut = usePatchContent(id ?? '');

  const draft = data?.draft;
  const errMsg = (error as Error | undefined)?.message ?? (data?.ok === false ? data.error : null);

  const [tab, setTab] = React.useState<TabKey>('edited');
  const [editedDraft, setEditedDraft] = React.useState<string>('');

  // Hydrate edited from server data on first load. Always prefer:
  //   1. server-saved edited_content (founder previously edited)
  //   2. judge-picked draft (default starting point)
  React.useEffect(() => {
    if (!draft) return;
    const initial = draft.edited_content ?? draft.drafts[draft.judge_pick] ?? '';
    setEditedDraft(initial);
  }, [draft]);

  if (isLoading && !draft) {
    return (
      <div className="space-y-4">
        <Link href="/content" className="inline-flex items-center text-sm text-muted-foreground hover:text-gold">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">Đang tải...</CardContent>
        </Card>
      </div>
    );
  }

  if (errMsg || !draft) {
    return (
      <div className="space-y-4">
        <Link href="/content" className="inline-flex items-center text-sm text-muted-foreground hover:text-gold">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
        <ErrorBlock title="Không tải được draft" message={errMsg ?? 'Không tìm thấy draft.'} />
      </div>
    );
  }

  function onSaveDraft() {
    if (!draft) return;
    patchMut.mutate(
      { edited_content: editedDraft },
      {
        onSuccess: (res) => {
          if (res.ok) toast.success('Đã lưu draft');
          else toast.error('Lưu thất bại', { description: res.error });
        },
        onError: (e) => toast.error('Lưu thất bại', { description: (e as Error).message }),
      },
    );
  }

  function onMarkForReview() {
    patchMut.mutate(
      { edited_content: editedDraft, status: 'in_review' },
      {
        onSuccess: (res) => {
          if (res.ok) toast.success('Đã đánh dấu review');
          else toast.error('Cập nhật thất bại', { description: res.error });
        },
        onError: (e) => toast.error('Cập nhật thất bại', { description: (e as Error).message }),
      },
    );
  }

  function onPublish() {
    if (!editedDraft.trim()) {
      toast.error('Bản edited rỗng — không thể publish');
      return;
    }
    if (!draft) return;
    const confirmMsg =
      draft.type === 'newsletter'
        ? 'Publish sẽ gửi newsletter qua Resend Audience. Tiếp tục?'
        : `Publish sẽ ghi MDX vào KV cho slug /${draft.slug}. Tiếp tục?`;
    if (typeof window !== 'undefined' && !window.confirm(confirmMsg)) return;
    patchMut.mutate(
      { edited_content: editedDraft, status: 'published' },
      {
        onSuccess: (res) => {
          if (res.ok) {
            if (res.publish_result?.ok) {
              toast.success(
                draft.type === 'newsletter' ? 'Đã gửi newsletter' : 'Đã publish pillar',
                {
                  description: res.publish_result.externalId
                    ? `External id: ${res.publish_result.externalId}`
                    : undefined,
                },
              );
            } else {
              toast.error('Publish side-effect lỗi', {
                description: res.publish_result?.error ?? 'unknown',
              });
            }
          } else {
            toast.error('Publish thất bại', { description: res.error });
          }
        },
        onError: (e) => toast.error('Publish thất bại', { description: (e as Error).message }),
      },
    );
  }

  function onArchive() {
    if (typeof window !== 'undefined' && !window.confirm('Lưu trữ draft này?')) return;
    patchMut.mutate(
      { status: 'archived' },
      {
        onSuccess: () => toast.success('Đã lưu trữ'),
        onError: (e) => toast.error('Thất bại', { description: (e as Error).message }),
      },
    );
  }

  const publishedAlready = draft.status === 'published';
  const canPublish = !publishedAlready && editedDraft.trim().length > 0;

  const judgeScores = draft.judge_scores ?? {};

  return (
    <div className="space-y-6">
      <Link href="/content" className="inline-flex items-center text-sm text-muted-foreground hover:text-gold">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Quay lại danh sách
      </Link>

      <PageHeader
        title={draft.topic}
        description={
          draft.slug ? (
            <>
              <span className="font-mono">/{draft.slug}</span> · {draft.type}
            </>
          ) : (
            draft.type
          )
        }
        badge={<StatusBadge status={STATUS_TONE[draft.status]} label={draft.status} />}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={onSaveDraft} disabled={patchMut.isPending}>
              <Save className="mr-2 h-4 w-4" />
              Lưu draft
            </Button>
            <Button size="sm" variant="outline" onClick={onMarkForReview} disabled={patchMut.isPending || draft.status === 'in_review'}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Mark review
            </Button>
            <Button size="sm" onClick={onPublish} disabled={!canPublish || patchMut.isPending}>
              <Send className="mr-2 h-4 w-4" />
              Publish
            </Button>
            <Button size="sm" variant="outline" onClick={onArchive} disabled={patchMut.isPending || draft.status === 'archived'}>
              <Archive className="mr-2 h-4 w-4" />
              Lưu trữ
            </Button>
          </div>
        }
      />

      {/* Judge summary card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Judge chọn: <span className="text-gold">{JUDGE_LABEL[draft.judge_pick]}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {draft.judge_reasoning && <p>{draft.judge_reasoning}</p>}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {(['claude', 'openai', 'google'] as DraftKey[]).map((k) => {
              const s = judgeScores[k];
              if (!s) return null;
              return (
                <div
                  key={k}
                  className={cn(
                    'rounded-md border px-3 py-2',
                    k === draft.judge_pick ? 'border-gold/40 bg-gold/5' : 'border-border',
                  )}
                >
                  <div className="mb-1 text-xs font-semibold text-foreground">{JUDGE_LABEL[k]}</div>
                  <div className="space-y-0.5 font-mono text-[11px]">
                    {Object.entries(s).map(([axis, val]) => (
                      <div key={axis} className="flex justify-between">
                        <span>{axis}</span>
                        <span className="text-foreground">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Side-by-side / editor tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="space-y-3">
        <TabsList>
          {(['claude', 'openai', 'google'] as DraftKey[]).map((k) => {
            const isJudgePick = k === draft.judge_pick;
            return (
              <TabsTrigger key={k} value={k} disabled={!draft.drafts[k]}>
                {JUDGE_LABEL[k]}
                {isJudgePick && <span className="ml-1 text-gold">★</span>}
              </TabsTrigger>
            );
          })}
          <TabsTrigger value="edited">Edited (final)</TabsTrigger>
        </TabsList>

        {(['claude', 'openai', 'google'] as DraftKey[]).map((k) => (
          <TabsContent key={k} value={k}>
            <Card>
              <CardContent className="prose prose-sm max-w-none whitespace-pre-wrap p-4 text-foreground">
                {draft.drafts[k] ?? <span className="text-muted-foreground">(không có bản draft)</span>}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="edited">
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Markdown editor — đây là bản sẽ được publish. Mặc định khởi tạo từ {JUDGE_LABEL[draft.judge_pick]}.
                </span>
                <span className="font-mono">{editedDraft.length} ký tự</span>
              </div>
              <Textarea
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                rows={30}
                className="font-mono text-sm"
                placeholder="Markdown bản chỉnh sửa cuối..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

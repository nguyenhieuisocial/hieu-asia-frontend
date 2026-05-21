'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
  toast,
} from '@hieu-asia/ui';
import { ChevronLeft, Eye, GitCompare } from 'lucide-react';
import { PromptEditor } from '@/components/prompts/PromptEditor';

const ROLES = ['vision', 'logic', 'psychology', 'alignment', 'report', 'mentor', 'judge'] as const;
type Role = (typeof ROLES)[number];

interface PromptDetail {
  role: Role;
  system: string;
  updated_at: string | null;
  updated_by: string | null;
  version: number;
  is_custom: boolean;
  default_system?: string;
  history?: Array<{ version: number; updated_at: string; updated_by: string | null }>;
}

interface PromptResp {
  ok: boolean;
  prompt?: PromptDetail;
  error?: string;
}

const CHAR_WARN = 10_000;
const PLACEHOLDERS = ['{{user_id}}', '{{session_id}}'];

async function fetchPrompt(role: string): Promise<PromptDetail | null> {
  const r = await fetch(`/api/admin/prompts/${role}`, { cache: 'no-store' });
  if (r.status === 404) return null;
  const data: PromptResp = await r.json();
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.prompt ?? null;
}

async function savePrompt(role: string, system: string): Promise<PromptDetail> {
  const r = await fetch(`/api/admin/prompts/${role}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system }),
  });
  const data: PromptResp = await r.json();
  if (!r.ok || !data.ok || !data.prompt) {
    throw new Error(data.error ?? `HTTP ${r.status}`);
  }
  return data.prompt;
}

async function resetPrompt(role: string): Promise<PromptDetail> {
  const r = await fetch(`/api/admin/prompts/${role}`, { method: 'POST' });
  const data: PromptResp = await r.json();
  if (!r.ok || !data.ok || !data.prompt) {
    throw new Error(data.error ?? `HTTP ${r.status}`);
  }
  return data.prompt;
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
}

/** Tiny line-diff for hint panel — counts +/- lines vs default. */
function diffSummary(a: string, b: string): { added: number; removed: number } {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const aSet = new Set(aLines);
  const bSet = new Set(bLines);
  let added = 0;
  let removed = 0;
  for (const l of aLines) if (!bSet.has(l)) added++;
  for (const l of bLines) if (!aSet.has(l)) removed++;
  return { added, removed };
}

/**
 * Line-by-line diff between two prompt bodies. Returns rows tagged 'add' /
 * 'remove' / 'context'. Uses LCS-light: simple line-by-line membership in
 * the opposite set — good enough for prompt comparisons (no reordering
 * detection, but visually correct for typical edits).
 */
function lineDiff(a: string, b: string): Array<{ kind: 'add' | 'remove' | 'ctx'; text: string }> {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const bSet = new Set(bLines);
  const aSet = new Set(aLines);
  const max = Math.max(aLines.length, bLines.length);
  const out: Array<{ kind: 'add' | 'remove' | 'ctx'; text: string }> = [];
  for (let i = 0; i < max; i++) {
    const cur = aLines[i];
    const old = bLines[i];
    if (cur !== undefined && old !== undefined && cur === old) {
      out.push({ kind: 'ctx', text: cur });
    } else {
      if (old !== undefined && !aSet.has(old)) out.push({ kind: 'remove', text: old });
      if (cur !== undefined && !bSet.has(cur)) out.push({ kind: 'add', text: cur });
    }
  }
  return out;
}

export default function PromptEditPage() {
  const params = useParams<{ role: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const role = params.role as Role;
  const isValidRole = (ROLES as readonly string[]).includes(role);

  const { data: prompt, isLoading, error } = useQuery({
    queryKey: ['admin', 'prompts', role],
    queryFn: () => fetchPrompt(role),
    enabled: isValidRole,
  });

  const [draft, setDraft] = React.useState<string>('');
  const [dirty, setDirty] = React.useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = React.useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [diffOpen, setDiffOpen] = React.useState(false);

  // Seed editor when prompt loads
  React.useEffect(() => {
    if (prompt && !dirty) {
      setDraft(prompt.system);
    }
  }, [prompt, dirty]);

  const saveMut = useMutation({
    mutationFn: () => savePrompt(role, draft),
    onSuccess: (updated) => {
      toast.success('Đã lưu prompt', { description: `Phiên bản v${updated.version}` });
      qc.setQueryData(['admin', 'prompts', role], updated);
      qc.invalidateQueries({ queryKey: ['admin', 'prompts'] });
      setDirty(false);
      setConfirmSaveOpen(false);
    },
    onError: (e) => {
      toast.error('Lưu thất bại', { description: (e as Error).message });
    },
  });

  const resetMut = useMutation({
    mutationFn: () => resetPrompt(role),
    onSuccess: (updated) => {
      toast.success('Đã khôi phục mặc định');
      qc.setQueryData(['admin', 'prompts', role], updated);
      qc.invalidateQueries({ queryKey: ['admin', 'prompts'] });
      setDraft(updated.system);
      setDirty(false);
      setConfirmResetOpen(false);
    },
    onError: (e) => {
      toast.error('Khôi phục thất bại', { description: (e as Error).message });
    },
  });

  if (!isValidRole) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Vai trò không hợp lệ</AlertTitle>
        <AlertDescription>
          Role <code className="font-mono">{role}</code> không tồn tại.{' '}
          <Link href="/prompts" className="text-gold underline">
            Quay lại
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }

  const overLimit = draft.length > CHAR_WARN;
  const hasDefaultDiff = prompt?.default_system && draft !== prompt.default_system;
  const diff = prompt?.default_system ? diffSummary(draft, prompt.default_system) : null;

  return (
    <div className="space-y-6">
      {/* Header / breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/prompts"
            className="inline-flex items-center gap-1 text-xs text-cream/60 hover:text-gold"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prompts
          </Link>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-cream">
            {role}
            {prompt && (
              <span className="ml-2 font-mono text-xs font-normal text-cream/60">
                v{prompt.version} · {prompt.is_custom ? 'custom' : 'default'}
              </span>
            )}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDiffOpen(true)}
            disabled={!prompt?.default_system || !draft}
          >
            <GitCompare className="mr-1.5 h-3.5 w-3.5" />
            So sánh v{prompt?.version ?? 1} ↔ default
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            disabled={!draft}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Preview
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Không tải được prompt</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Skeleton className="h-[60vh] w-full" />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
          {/* Editor 70% */}
          <div className="lg:col-span-7 space-y-3">
            <PromptEditor
              value={draft}
              onChange={(v) => {
                setDraft(v);
                setDirty(true);
              }}
              onSave={() => setConfirmSaveOpen(true)}
              placeholder="System prompt — hỗ trợ {{user_id}}, {{session_id}}"
            />

            {/* Warnings */}
            <div className="space-y-2">
              {overLimit && (
                <Alert variant="warning">
                  <AlertTitle>Prompt khá dài</AlertTitle>
                  <AlertDescription>
                    {draft.length.toLocaleString('vi-VN')} ký tự &gt; {CHAR_WARN.toLocaleString('vi-VN')}.
                    Cân nhắc rút gọn — prompt dài tốn token mỗi lượt gọi LLM.
                  </AlertDescription>
                </Alert>
              )}
              {hasDefaultDiff && diff && (
                <Alert variant="default">
                  <AlertTitle>Khác mặc định</AlertTitle>
                  <AlertDescription>
                    +{diff.added} dòng mới · -{diff.removed} dòng đã xóa so với DEFAULT_PROMPTS.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Metadata 30% */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-cream/70">
                <div>
                  Phiên bản: <span className="font-mono text-gold">v{prompt?.version ?? 1}</span>
                </div>
                <div>
                  Trạng thái:{' '}
                  <span className={prompt?.is_custom ? 'text-gold' : 'text-cream/60'}>
                    {prompt?.is_custom ? 'custom' : 'default'}
                  </span>
                </div>
                <div>
                  Cập nhật: <span className="text-cream/90">{fmtDate(prompt?.updated_at ?? null)}</span>
                </div>
                <div>
                  Bởi: <span className="text-cream/90">{prompt?.updated_by ?? '—'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Placeholders hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {PLACEHOLDERS.map((p) => (
                  <code
                    key={p}
                    className="block rounded border border-gold/15 bg-ink/60 px-2 py-1 font-mono text-xs text-cream/80"
                  >
                    {p}
                  </code>
                ))}
                <p className="pt-1 text-[11px] text-cream/55">
                  Sẽ được thay khi gọi LLM. Giữ nguyên syntax 2 dấu ngoặc nhọn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Lịch sử (5 gần nhất)</CardTitle>
              </CardHeader>
              <CardContent>
                {!prompt?.history?.length ? (
                  <p className="text-xs text-cream/55">Chưa có lịch sử.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {prompt.history.slice(0, 5).map((h) => (
                      <li
                        key={h.version}
                        className="flex items-center justify-between border-b border-gold/10 pb-1.5 last:border-0"
                      >
                        <span className="font-mono text-gold/80">v{h.version}</span>
                        <span className="text-cream/70">{fmtDate(h.updated_at)}</span>
                        <span className="truncate text-cream/55">{h.updated_by ?? '—'}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-2 border-t border-gold/15 bg-ink/95 py-3 backdrop-blur">
        <Button variant="ghost" onClick={() => router.push('/prompts')} disabled={saveMut.isPending}>
          Hủy
        </Button>
        <Button
          variant="outline"
          onClick={() => setConfirmResetOpen(true)}
          disabled={saveMut.isPending || resetMut.isPending || !prompt?.is_custom}
        >
          Khôi phục mặc định
        </Button>
        <Button
          onClick={() => setConfirmSaveOpen(true)}
          disabled={!dirty || saveMut.isPending || isLoading}
        >
          {saveMut.isPending ? 'Đang lưu…' : 'Lưu'}
        </Button>
      </div>

      {/* Save confirm */}
      <Dialog open={confirmSaveOpen} onOpenChange={setConfirmSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lưu prompt cho vai trò {role}?</DialogTitle>
            <DialogDescription>
              Sẽ áp dụng ngay cho mọi phiên phân tích mới. Version sẽ tăng lên v
              {(prompt?.version ?? 1) + 1}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmSaveOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
              {saveMut.isPending ? 'Đang lưu…' : 'Xác nhận lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset confirm */}
      <Dialog open={confirmResetOpen} onOpenChange={setConfirmResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Khôi phục mặc định?</DialogTitle>
            <DialogDescription>
              Sẽ ghi đè custom prompt hiện tại bằng DEFAULT_PROMPTS. Hành động không hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmResetOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={() => resetMut.mutate()}
              disabled={resetMut.isPending}
              className="border-red-400/40 text-red-200 hover:bg-red-500/10"
            >
              {resetMut.isPending ? 'Đang khôi phục…' : 'Khôi phục'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version diff (current draft vs default) */}
      <Dialog open={diffOpen} onOpenChange={setDiffOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>So sánh phiên bản</DialogTitle>
            <DialogDescription>
              Bên trái: bản hiện đang chỉnh (v{prompt?.version ?? 1}{dirty ? ' + chưa lưu' : ''}). Bên
              phải / inline: DEFAULT_PROMPTS gốc.
            </DialogDescription>
          </DialogHeader>
          {prompt?.default_system ? (
            <div className="max-h-[60vh] overflow-auto rounded-md border border-gold/15 bg-ink/60 font-mono text-xs leading-5">
              {lineDiff(draft, prompt.default_system).map((row, i) => (
                <div
                  key={i}
                  className={
                    row.kind === 'add'
                      ? 'bg-emerald-500/10 px-3 py-0.5 text-emerald-200'
                      : row.kind === 'remove'
                        ? 'bg-red-500/10 px-3 py-0.5 text-red-200'
                        : 'px-3 py-0.5 text-cream/70'
                  }
                >
                  <span className="mr-2 select-none text-cream/35">
                    {row.kind === 'add' ? '+' : row.kind === 'remove' ? '-' : ' '}
                  </span>
                  {row.text || ' '}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cream/55">Chưa load được default — thử reload.</p>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDiffOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Preview — LLM call format</DialogTitle>
            <DialogDescription>
              Đây là cách prompt sẽ được gửi đến LLM (system message). Placeholders chưa thay.
            </DialogDescription>
          </DialogHeader>
          <pre className="max-h-[60vh] overflow-auto rounded-md border border-gold/15 bg-ink/60 p-4 font-mono text-xs leading-5 text-cream/90">
{`role: system
content: |
${draft
  .split('\n')
  .map((l) => '  ' + l)
  .join('\n')}`}
          </pre>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPreviewOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  toast,
} from '@hieu-asia/ui';

const CONFIRM_TYPED = 'XÓA TÀI KHOẢN';
const CONFIRM_BACKEND = 'DELETE_MY_DATA_FOREVER';

export interface DeleteAccountSectionProps {
  userId: string | null;
}

interface EraseResponse {
  ok: boolean;
  counts?: {
    reading_sessions: number;
    transactions: number;
    audit_entries: number;
    r2_objects: number;
    anonymized_records: number;
  };
  error?: string;
}

type Stage = 'idle' | 'level1' | 'level2';

export function DeleteAccountSection({ userId }: DeleteAccountSectionProps) {
  const router = useRouter();
  const [stage, setStage] = React.useState<Stage>('idle');
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [typed, setTyped] = React.useState('');
  const [pending, setPending] = React.useState(false);

  function reset() {
    setStage('idle');
    setAcknowledged(false);
    setTyped('');
  }

  async function handleConfirmFinal() {
    if (!userId) {
      toast.error('Không xác định được tài khoản');
      return;
    }
    if (typed.trim().toUpperCase() !== CONFIRM_TYPED) {
      toast.error('Chuỗi xác nhận không khớp');
      return;
    }
    setPending(true);
    try {
      const res = await fetch('/api/account/erase', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_id: userId, confirm: CONFIRM_BACKEND }),
      });
      // Guard against HTML error pages (Vercel 502, gateway timeout) —
      // never feed a non-JSON body to JSON.parse.
      const ct = res.headers.get('content-type') ?? '';
      if (!/\bjson\b/i.test(ct)) {
        toast.error('Xóa tài khoản thất bại', {
          description: `Phản hồi không phải JSON (HTTP ${res.status})`,
        });
        setPending(false);
        return;
      }
      const data: EraseResponse = await res.json();
      if (!res.ok || !data.ok) {
        toast.error('Xóa tài khoản thất bại', {
          description: data.error ?? `HTTP ${res.status}`,
        });
        setPending(false);
        return;
      }
      // Clear local identifiers so refresh starts clean
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch {
        /* ignore */
      }
      const c = data.counts;
      toast.success('Đã xóa tài khoản', {
        description: c
          ? `Phiên đọc: ${c.reading_sessions} · Ẩn danh hóa: ${c.anonymized_records} · File: ${c.r2_objects}`
          : 'Toàn bộ dữ liệu cá nhân đã được xóa.',
      });
      router.push('/?account_erased=1');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Lỗi mạng', { description: msg });
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="border-red-500/40 bg-red-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-red-300">
          <span aria-hidden>⚠</span>
          Xóa tài khoản
        </CardTitle>
        <CardDescription className="text-cream/75">
          Hành động này <strong className="text-red-200">KHÔNG thể hoàn tác</strong>.
          Toàn bộ phiên đọc, ảnh palm, báo cáo, giao dịch sẽ bị xóa vĩnh viễn
          trong vòng 30 ngày.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-cream/85">
        <ul className="list-disc space-y-1 pl-5 text-cream/75">
          <li>Xóa PII: ảnh palm/face, dữ liệu sinh, kết quả MBTI.</li>
          <li>Ẩn danh hóa các bản ghi phân tích (không thể tái định danh).</li>
          <li>Xóa OAuth tokens, sessions, lịch sử giao dịch.</li>
          <li>Ghi 1 mục audit "user_erased" — lưu 12 tháng.</li>
        </ul>

        {stage === 'idle' && (
          <Button
            variant="outline"
            onClick={() => setStage('level1')}
            className="border-red-400/60 text-red-200 hover:bg-red-500/10"
          >
            Tôi muốn xóa tài khoản
          </Button>
        )}

        {stage === 'level1' && (
          <div className="space-y-3 rounded-md border border-red-400/30 bg-ink/40 p-4">
            <p className="font-semibold text-red-200">Bạn có chắc không?</p>
            <label className="flex items-start gap-3">
              <Checkbox
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
              />
              <span className="text-xs text-cream/80">
                Tôi hiểu rằng dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
              </span>
            </label>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={reset} disabled={pending}>
                Hủy
              </Button>
              <Button
                onClick={() => setStage('level2')}
                disabled={!acknowledged}
                className="bg-red-500/80 text-cream hover:bg-red-500"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        )}

        {stage === 'level2' && (
          <div className="space-y-3 rounded-md border border-red-400/40 bg-ink/40 p-4">
            <p className="font-semibold text-red-200">
              Bước cuối: gõ <code className="rounded bg-ink px-2 py-0.5 text-red-100">{CONFIRM_TYPED}</code> để xác nhận
            </p>
            <Input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={CONFIRM_TYPED}
              autoFocus
              className="border-red-400/40 bg-ink/60 font-mono"
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={reset} disabled={pending}>
                Hủy
              </Button>
              <Button
                onClick={handleConfirmFinal}
                disabled={pending || typed.trim().toUpperCase() !== CONFIRM_TYPED}
                className="bg-red-500/80 text-cream hover:bg-red-500"
              >
                {pending ? 'Đang xóa…' : 'Xóa tài khoản vĩnh viễn'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

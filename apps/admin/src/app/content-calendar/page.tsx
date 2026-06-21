'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Skeleton,
  toast,
} from '@hieu-asia/ui';
import { CalendarDays, Sparkles, Moon, Info } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import { formatDateOrEmpty } from '@/lib/format-date';

const PROXY = '/api/admin-proxy';

interface CalendarSlot {
  date: string; // YYYY-MM-DD
  lunar: string;
  events: string[];
  suggested_content: string[];
}
interface CalendarResp {
  ok: boolean;
  slots?: CalendarSlot[];
  error?: string;
}

async function fetchCalendar(): Promise<CalendarSlot[]> {
  const r = await fetch(`${PROXY}/daily/content-calendar`, { cache: 'no-store' });
  const data = (await r.json()) as CalendarResp;
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.slots ?? [];
}

const fmtDate = (iso: string) => formatDateOrEmpty(iso, iso);
const daysUntil = (iso: string): number | null => {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  const today = new Date();
  const t0 = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((t - t0) / 86_400_000);
};

export default function ContentCalendarPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'content-calendar'],
    queryFn: fetchCalendar,
    staleTime: 5 * 60_000,
  });

  const [topic, setTopic] = React.useState<string | null>(null);

  const genMut = useMutation({
    mutationFn: async (t: string) => {
      const r = await fetch(`${PROXY}/admin/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t, type: 'pillar' }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d?.ok === false) throw new Error(d?.error ?? `HTTP ${r.status}`);
      return d;
    },
    onSuccess: () => {
      toast.success('Đã tạo bản nháp', { description: 'Xem & duyệt ở trang Nội dung (/content).' });
      setTopic(null);
    },
    onError: (e) => toast.error('Tạo bài thất bại', { description: (e as Error).message }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<CalendarDays className="h-5 w-5 text-gold" />}
        title="Lịch nội dung theo mùa"
        description="Các ngày âm lịch hút traffic trong 60 ngày tới + gợi ý bài viết. Bấm 'Tạo bài' để dựng bản nháp (xong vào /content duyệt)."
      />

      <Card className="border-gold/15 bg-card/60">
        <CardContent className="flex items-start gap-2 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <span>
            "Tạo bài" gọi AI (tốn phí nhỏ) và chỉ tạo <strong>bản nháp</strong> — nội dung KHÔNG tự đăng;
            anh duyệt + xuất bản ở{' '}
            <Link href="/content" className="text-gold underline-offset-2 hover:underline">/content</Link>.
          </span>
        </CardContent>
      </Card>

      {error ? (
        <ErrorBlock message={(error as Error).message} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Không có sự kiện âm lịch nổi bật trong 60 ngày tới"
          description="Lịch sẽ hiện các ngày mùng 1, rằm, Tết, Vu Lan, Trung Thu, Ông Táo… khi tới gần."
        />
      ) : (
        <div className="space-y-3">
          {data.map((slot) => {
            const d = daysUntil(slot.date);
            return (
              <Card key={slot.date}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{fmtDate(slot.date)}</span>
                      {d !== null && (
                        <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold">
                          {d <= 0 ? 'hôm nay' : `còn ${d} ngày`}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Moon className="h-3 w-3" /> {slot.lunar}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {slot.events.map((ev) => (
                        <span key={ev} className="rounded bg-purple-500/15 px-1.5 py-0.5 text-[10px] text-purple-600 dark:text-purple-300">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                  {slot.suggested_content.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-gold" /> Gợi ý:
                      </span>
                      {slot.suggested_content.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTopic(s)}
                          disabled={genMut.isPending}
                          className="rounded-full border border-gold/25 px-2 py-0.5 text-[11px] text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-50"
                          title="Tạo bản nháp cho chủ đề này"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Generate confirm */}
      <Dialog open={!!topic} onOpenChange={(o) => !o && setTopic(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo bản nháp bài viết?</DialogTitle>
            <DialogDescription>
              Chủ đề: <strong>{topic}</strong>. Sẽ gọi AI tạo 1 bản nháp (tốn phí nhỏ) — KHÔNG tự đăng, anh
              duyệt ở /content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTopic(null)}>Hủy</Button>
            <Button onClick={() => topic && genMut.mutate(topic)} disabled={genMut.isPending}>
              {genMut.isPending ? 'Đang tạo…' : 'Tạo bản nháp'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

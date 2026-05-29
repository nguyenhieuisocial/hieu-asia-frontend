'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';

interface MentorSession {
  reading_id: string;
  last_message_at: string;
  preview?: string;
}

interface MentorMemory {
  currentGoals: string[];
  openDecisions: string[];
}

function loadLocalSessions(): MentorSession[] {
  if (typeof window === 'undefined') return [];
  const out: MentorSession[] = [];
  const PREFIX = 'hieu.mentor.history.';
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const reading_id = k.slice(PREFIX.length);
      try {
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        const parsed = JSON.parse(raw) as Array<{ ts?: string; content?: string; role?: string }>;
        if (!Array.isArray(parsed) || parsed.length === 0) continue;
        const last = parsed[parsed.length - 1];
        if (!last) continue;
        out.push({
          reading_id,
          last_message_at: last.ts ?? new Date().toISOString(),
          preview: typeof last.content === 'string' ? last.content.slice(0, 80) : undefined,
        });
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
  out.sort((a, b) => (a.last_message_at < b.last_message_at ? 1 : -1));
  return out;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export function MentorTab() {
  const [sessions, setSessions] = React.useState<MentorSession[]>([]);
  const [memory, setMemory] = React.useState<MentorMemory | null>(null);
  const [memoryError, setMemoryError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setSessions(loadLocalSessions());

    // Fetch mentor memory snapshot using user JWT (Supabase access_token)
    (async () => {
      const supa = getSupabaseAuth();
      if (!supa) return;
      const { data } = await supa.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      try {
        const res = await fetch('/api/mentor?action=memory', {
          headers: { authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const j = await safeJson<{ ok: boolean; memory?: MentorMemory; error?: string }>(res);
        if (cancelled) return;
        if (j.ok && j.data.memory) {
          setMemory(j.data.memory);
        } else if (!j.ok) {
          setMemoryError(`HTTP ${j.status}`);
        }
      } catch (err) {
        if (cancelled) return;
        setMemoryError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      role="tabpanel"
      id="panel-mentor"
      aria-labelledby="tab-mentor"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Mentor</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Các cuộc trò chuyện với mentor và bộ nhớ cá nhân hóa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bộ nhớ mentor</CardTitle>
          <CardDescription>
            Mentor sẽ nhớ những mục tiêu &amp; quyết định bạn đang theo đuổi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {memoryError && (
            <p className="text-xs text-amber-300/80">
              Không tải được bộ nhớ ({memoryError}). Sẽ thử lại lần sau.
            </p>
          )}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Mục tiêu hiện tại
            </p>
            {memory && memory.currentGoals.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/85">
                {memory.currentGoals.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted-foreground">Chưa có mục tiêu nào được mentor ghi nhận.</p>
            )}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Quyết định mở
            </p>
            {memory && memory.openDecisions.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/85">
                {memory.openDecisions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted-foreground">Không có quyết định nào đang treo.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Lịch sử chat</CardTitle>
              <CardDescription>Các phiên đọc đã từng chat với mentor.</CardDescription>
            </div>
            <Button variant="outline" asChild={false}>
              <Link href="/reading">Phiên đọc mới</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa có cuộc trò chuyện. Bắt đầu chat →{' '}
              <Link href="/reading" className="text-gold hover:underline">
                /reading
              </Link>
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {sessions.map((s) => (
                <li key={s.reading_id} className="py-3">
                  <Link
                    href={`/reading/${s.reading_id}/mentor`}
                    className="flex items-center gap-3 hover:text-gold"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground/90">
                        {s.preview ?? `Phiên ${s.reading_id.slice(0, 8)}`}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {fmtDate(s.last_message_at)} · {s.reading_id.slice(0, 12)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-foreground/40" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

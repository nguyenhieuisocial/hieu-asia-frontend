/**
 * /affiliates/broadcast — admin broadcast composer + history.
 * Sends subject/body to all (or active-only) affiliates via in_app/email/telegram.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Checkbox } from '@hieu-asia/ui';

type Channel = 'email' | 'telegram' | 'in_app';
type TargetStatus = 'active' | 'all';

interface Broadcast {
  id: string;
  subject: string;
  body: string;
  channels: Channel[];
  target_status: TargetStatus;
  created_at: string;
  recipients: number;
  status: 'queued' | 'sent' | 'failed';
}

const CHANNEL_LABEL: Record<Channel, string> = {
  in_app: 'In-app',
  email: 'Email',
  telegram: 'Telegram',
};

function dt(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function AdminBroadcastPage() {
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [channels, setChannels] = React.useState<Channel[]>(['in_app']);
  const [target, setTarget] = React.useState<TargetStatus>('active');
  const [history, setHistory] = React.useState<Broadcast[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  const loadHistory = React.useCallback(async () => {
    try {
      const r = await fetch('/api/admin/affiliates/email-blast', { cache: 'no-store' });
      const d = await r.json();
      if (d.ok) setHistory(d.broadcasts ?? []);
    } catch {
      // non-fatal
    }
  }, []);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  function toggleChannel(c: Channel) {
    setChannels((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  }

  async function submit() {
    if (!subject.trim() || !body.trim()) {
      setMsg({ ok: false, text: 'Subject + body bắt buộc' });
      return;
    }
    if (channels.length === 0) {
      setMsg({ ok: false, text: 'Chọn ít nhất 1 channel' });
      return;
    }
    if (!confirm(`Gửi broadcast tới affiliates ${target === 'all' ? '(tất cả)' : '(active only)'}?`)) {
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const r = await fetch('/api/admin/affiliates/email-blast', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject, body, channels, target_status: target }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error ?? 'Gửi thất bại');
      setMsg({ ok: true, text: `Đã queue tới ${d.recipients} affiliates` });
      setSubject('');
      setBody('');
      await loadHistory();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-card p-6 text-foreground">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Broadcast tới affiliates</h1>
            <p className="text-sm text-muted-foreground">
              In-app notifications hiển thị ngay trong dashboard. Email/Telegram được queue và gửi qua
              hệ thống delivery riêng.
            </p>
          </div>
          <Link href="/affiliates">
            <Button variant="ghost" className="border border-border">
              Quay lại
            </Button>
          </Link>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Soạn broadcast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase text-muted-foreground">Tiêu đề</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="VD: Khuyến mãi tháng 6 — hoa hồng x1.5"
                maxLength={120}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase text-muted-foreground">Nội dung</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Nội dung markdown / plain text…"
                rows={6}
                maxLength={4000}
              />
              <p className="mt-1 text-xs text-muted-foreground">{body.length} / 4000</p>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase text-muted-foreground">Channels</div>
              <div className="flex flex-wrap gap-3">
                {(['in_app', 'email', 'telegram'] as Channel[]).map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={channels.includes(c)} onChange={() => toggleChannel(c)} />
                    {CHANNEL_LABEL[c]}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase text-muted-foreground">Đối tượng</div>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as TargetStatus)}
                className="rounded border border-border bg-card p-2 text-sm text-foreground"
              >
                <option value="active">Chỉ active</option>
                <option value="all">Tất cả (kể cả banned)</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={submit}
                disabled={submitting}
                className="bg-gold text-ink hover:bg-gold/90"
              >
                {submitting ? 'Đang gửi…' : 'Gửi broadcast'}
              </Button>
              {msg && (
                <span className={`text-sm ${msg.ok ? 'text-green-400' : 'text-red-300'}`}>
                  {msg.text}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lịch sử ({history.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có broadcast nào.</p>
            ) : (
              <div className="space-y-2">
                {history.map((b) => (
                  <div key={b.id} className="rounded border border-border bg-muted/30 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{b.subject}</span>
                      <span className="text-xs text-muted-foreground">{dt(b.created_at)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-muted-foreground">{b.body}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{b.recipients} recipients</span>
                      <span>· {b.channels.map((c) => CHANNEL_LABEL[c]).join(' · ')}</span>
                      <span>· {b.target_status === 'all' ? 'tất cả' : 'active'}</span>
                      <span
                        className={`ml-auto rounded px-2 py-0.5 text-[10px] uppercase ${
                          b.status === 'sent'
                            ? 'bg-green-500/15 text-green-300'
                            : b.status === 'queued'
                            ? 'bg-yellow-500/15 text-yellow-300'
                            : 'bg-red-500/15 text-red-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

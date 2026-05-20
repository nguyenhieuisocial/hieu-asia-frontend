'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@hieu-asia/ui';
import { DataDeletionDialog } from './data-deletion-dialog';

// ---------- A. Reports ----------

export interface DashboardReport {
  id: string;
  date: string; // formatted
  primary_concern: string;
  status: 'completed' | 'running' | 'failed';
}

export function ReportsSection({ items }: { items: DashboardReport[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo của tôi</CardTitle>
          <CardDescription>
            Bạn chưa có báo cáo nào. Bắt đầu phân tích đầu tiên để có cẩm nang
            cuộc đời cá nhân hóa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild={false}>
            <Link href="/onboarding">Bắt đầu phân tích →</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((r) => (
        <Link
          key={r.id}
          href={`/reading/${r.id}/report`}
          className="group rounded-lg border border-gold/15 bg-ink/60 p-5 transition-colors hover:border-gold/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-md bg-gold/10 text-2xl text-gold"
            >
              ✋
            </div>
            <StatusBadge status={r.status} />
          </div>
          <p className="mt-3 font-mono text-xs text-cream/50">{r.date}</p>
          <p className="mt-1 text-sm text-cream/90 group-hover:text-gold">
            {r.primary_concern}
          </p>
        </Link>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: DashboardReport['status'] }) {
  const map = {
    completed: { label: 'Hoàn tất', cls: 'bg-jade-500/20 text-jade-50' },
    running: { label: 'Đang chạy', cls: 'bg-gold/20 text-gold' },
    failed: { label: 'Lỗi', cls: 'bg-red-500/20 text-red-200' },
  } as const;
  const m = map[status];
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
        m.cls,
      )}
    >
      {m.label}
    </span>
  );
}

// ---------- B. Mentor sessions ----------

export interface MentorSession {
  id: string;
  reading_id: string;
  message_count: number;
  last_message_preview: string;
  last_active: string;
}

export function MentorSessionsSection({
  sessions,
}: {
  sessions: MentorSession[];
}) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử Mentor</CardTitle>
          <CardDescription>
            Bạn chưa có cuộc trò chuyện nào với Mentor.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <ul className="space-y-3">
      {sessions.map((s) => (
        <li key={s.id}>
          <Link
            href={`/reading/${s.reading_id}/mentor`}
            className="flex items-center gap-4 rounded-lg border border-gold/15 bg-ink/60 p-4 hover:border-gold/40"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-purple/30 text-base">
              ☯
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-cream/90">
                {s.last_message_preview}
              </p>
              <p className="font-mono text-xs text-cream/50">
                {s.message_count} tin nhắn · {s.last_active}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ---------- C. Plan & usage ----------

export interface PlanUsage {
  plan_name: 'Gói miễn phí' | 'Gói Mentor Tháng' | 'Gói Founder';
  mentor_used: number;
  mentor_limit: number;
}

export function PlanSection({ usage }: { usage: PlanUsage }) {
  const pct = Math.min(100, (usage.mentor_used / usage.mentor_limit) * 100);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{usage.plan_name}</CardTitle>
        <CardDescription>
          Đã dùng {usage.mentor_used} / {usage.mentor_limit} lượt hỏi Mentor
          tháng này
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-2 overflow-hidden rounded-full bg-ink/60">
          <div
            className="h-full bg-gold-gradient transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <Button variant="outline">Nâng cấp gói</Button>
      </CardContent>
    </Card>
  );
}

// ---------- D. Settings ----------

export interface SettingsState {
  email_notifications: boolean;
  telegram_notifications: boolean;
  language: 'vi' | 'en';
}

export interface SettingsSectionProps {
  initial: SettingsState;
  onExport?: () => void;
  onDelete?: () => Promise<void> | void;
}

export function SettingsSection({
  initial,
  onExport,
  onDelete,
}: SettingsSectionProps) {
  const [state, setState] = React.useState(initial);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt & Quyền riêng tư</CardTitle>
          <CardDescription>
            Thông báo, ngôn ngữ và quản lý dữ liệu cá nhân.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Toggle
            label="Thông báo qua Email"
            checked={state.email_notifications}
            onChange={(v) =>
              setState((s) => ({ ...s, email_notifications: v }))
            }
          />
          <Toggle
            label="Thông báo qua Telegram"
            checked={state.telegram_notifications}
            onChange={(v) =>
              setState((s) => ({ ...s, telegram_notifications: v }))
            }
          />

          <div>
            <p className="mb-2 text-sm text-cream/80">Ngôn ngữ</p>
            <div className="flex gap-2">
              {(['vi', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, language: lang }))}
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-xs uppercase tracking-wider',
                    state.language === lang
                      ? 'border-gold bg-gold/15 text-gold'
                      : 'border-gold/20 text-cream/70 hover:border-gold/40',
                  )}
                >
                  {lang === 'vi' ? 'Tiếng Việt' : 'English'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-gold/15 pt-4">
            <Button variant="outline" onClick={onExport}>
              Xuất dữ liệu của tôi
            </Button>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
            >
              Xoá dữ liệu của tôi
            </Button>
          </div>
        </CardContent>
      </Card>
      <DataDeletionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={async () => {
          await onDelete?.();
          setDialogOpen(false);
        }}
      />
    </>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-cream/90">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-gold' : 'bg-cream/20',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  );
}

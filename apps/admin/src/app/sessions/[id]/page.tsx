'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatusBadge } from '@hieu-asia/ui';
import { getSession } from '@/lib/admin-api';
import type { TaskStatus } from '@hieu-asia/types';

const STATUS_TONE: Record<TaskStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  queued: 'neutral',
  running: 'info',
  completed: 'success',
  failed: 'error',
};

const MOCK_CHAT = [
  { role: 'user', content: 'Tôi nên xử lý middle manager chống đối thế nào?', ts: '2026-05-20 10:14' },
  {
    role: 'mentor',
    content:
      'Có 3 bước cụ thể: 1) Trao đổi 1:1 trước khi public, 2) Đặt KPI rõ ràng cho 14 ngày, 3) Quyết định tách hoặc retain dựa trên data.',
    ts: '2026-05-20 10:14',
  },
  { role: 'user', content: 'Nếu họ không cam kết KPI thì sao?', ts: '2026-05-20 10:16' },
  {
    role: 'mentor',
    content: 'Đây là "soft no" — chuẩn bị offboarding plan, thông báo HR, và song song tuyển backup. Đừng cảm tính.',
    ts: '2026-05-20 10:16',
  },
];

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const { data: session, isLoading } = useQuery({
    queryKey: ['admin', 'session', id],
    queryFn: () => getSession(id),
  });

  if (isLoading) {
    return <div className="animate-pulse text-cream/60">Đang tải session…</div>;
  }
  if (!session) {
    return <div className="text-cream/60">Không tìm thấy session.</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/sessions" className="text-sm text-cream/60 hover:text-gold">
        ← Quay lại danh sách
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-mono text-xl font-semibold text-gold">{session.session_id}</h1>
          <p className="mt-1 text-sm text-cream/70">User: {session.user_email}</p>
        </div>
        <StatusBadge status={STATUS_TONE[session.status]} label={session.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Tạo lúc">{new Date(session.created_at).toLocaleString('vi-VN')}</Stat>
        <Stat label="Thời lượng">{session.duration_seconds ? `${session.duration_seconds}s` : '—'}</Stat>
        <Stat label="Cost">${session.cost_usd.toFixed(3)}</Stat>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bối cảnh user</CardTitle>
          <CardDescription>{session.primary_concern}</CardDescription>
        </CardHeader>
      </Card>

      {session.error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-300">Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded border border-red-500/30 bg-red-500/5 p-3 font-mono text-xs text-red-200">
              {session.error}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Báo cáo final (mock)</CardTitle>
          <CardDescription>Markdown rendered từ `final_report_markdown`. Hiện đang là sample.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert prose-sm max-w-none rounded border border-gold/15 bg-ink/40 p-4 text-cream/85">
            <h3 className="text-gold">Tổng quan</h3>
            <p>
              User là người có xu hướng quyết định nhanh, đôi khi bốc đồng. Mạnh ở khả năng nhìn xa,
              yếu ở quản lý chi tiết hàng ngày. Mục tiêu: học cách phân quyền + giữ kỷ luật theo dõi
              chỉ số tài chính tuần.
            </p>
            <h3 className="text-gold">Hành động 30 ngày</h3>
            <ul>
              <li>Họp 1:1 với team trưởng, ra KPI rõ ràng.</li>
              <li>Đặt budget tháng và xem báo cáo dòng tiền mỗi thứ 6.</li>
              <li>Ghi nhật ký quyết định 5 phút mỗi tối.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử chat Mentor (mock)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_CHAT.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 ${
                m.role === 'user'
                  ? 'border-gold/20 bg-gold/5'
                  : 'border-purple/30 bg-purple/10'
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-cream/55">
                {m.role === 'user' ? 'User' : 'Mentor'} · {m.ts}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-cream">{m.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gold/15 bg-ink/40 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-cream/55">{label}</p>
      <p className="mt-1 font-heading text-lg text-cream">{children}</p>
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '@hieu-asia/ui';
import {
  ReportsSection,
  MentorSessionsSection,
  PlanSection,
  SettingsSection,
  type DashboardReport,
  type MentorSession,
  type PlanUsage,
  type SettingsState,
} from '@/components/dashboard-sections';
import { getOrCreateAnonUserId, listReadings } from '@hieu-asia/supabase';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { EmptyState } from '@/components/ui/EmptyState';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

// V1 mock: assume logged-in user. Real auth wired in Phase 2.
const MOCK_USER = { name: 'Anh Minh', email: 'minh@example.com' };

function formatVnDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function rowToReport(row: {
  session_id: string;
  state_json: { birth_data?: { primary_concern?: string | null; birth_place?: string }; status?: string };
  updated_at: string;
}): DashboardReport {
  const status: DashboardReport['status'] =
    row.state_json.status === 'completed' ? 'completed' :
    row.state_json.status === 'failed' ? 'failed' :
    'running';
  return {
    id: row.session_id,
    date: formatVnDate(row.updated_at),
    primary_concern:
      row.state_json.birth_data?.primary_concern ||
      `Báo cáo cho ${row.state_json.birth_data?.birth_place ?? '—'}`,
    status,
  };
}

const MOCK_SESSIONS: MentorSession[] = [
  {
    id: 's1',
    reading_id: 'demo-task-001',
    message_count: 12,
    last_message_preview:
      'Tôi gợi ý chia 7 ngày tới thành 3 giai đoạn: stabilize cash, talk to team…',
    last_active: '2 giờ trước',
  },
  {
    id: 's2',
    reading_id: 'demo-task-002',
    message_count: 5,
    last_message_preview: 'Trước khi mở chi nhánh mới, hãy kiểm tra 3 chỉ số…',
    last_active: '2 tháng trước',
  },
];

const MOCK_PLAN: PlanUsage = {
  plan_name: 'Gói Mentor Tháng',
  mentor_used: 17,
  mentor_limit: 60,
};

const MOCK_SETTINGS: SettingsState = {
  email_notifications: true,
  telegram_notifications: false,
  language: 'vi',
};

type SectionId = 'reports' | 'mentor' | 'plan' | 'settings';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'reports', label: 'Báo cáo của tôi' },
  { id: 'mentor', label: 'Lịch sử Mentor' },
  { id: 'plan', label: 'Gói & Lượt dùng' },
  { id: 'settings', label: 'Cài đặt & Quyền riêng tư' },
];

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}

function DashboardContent() {
  const [active, setActive] = React.useState<SectionId>('reports');
  const [reports, setReports] = React.useState<DashboardReport[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const userId = getOrCreateAnonUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    listReadings(userId)
      .then((rows) => setReports(rows.map(rowToReport)))
      .catch((e) => {
        console.warn('listReadings failed:', e);
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <main className="min-h-screen bg-ink-radial">
      <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 flex items-center gap-4">
          <div
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 font-heading text-lg text-gold"
          >
            {MOCK_USER.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-cream/50">Chào,</p>
            <h1 className="font-heading text-2xl text-cream">
              {MOCK_USER.name}
            </h1>
          </div>
        </header>

        <nav
          role="tablist"
          aria-label="Mục bảng điều khiển"
          className="mb-6 flex flex-wrap gap-2 border-b border-gold/15 pb-3"
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active === s.id
                  ? 'bg-gold/15 text-gold'
                  : 'text-cream/70 hover:bg-gold/5 hover:text-cream',
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <section role="tabpanel">
          {active === 'reports' && (
            reports.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                  </svg>
                }
                title="Chưa có phân tích nào"
                description="Bắt đầu phiên đầu tiên — chỉ mất 5 phút."
                action={{ label: 'Bắt đầu phân tích', href: '/onboarding' }}
              />
            ) : (
              <ReportsSection items={reports} />
            )
          )}
          {active === 'mentor' && (
            <MentorSessionsSection sessions={MOCK_SESSIONS} />
          )}
          {active === 'plan' && <PlanSection usage={MOCK_PLAN} />}
          {active === 'settings' && (
            <SettingsSection
              initial={MOCK_SETTINGS}
              onExport={() => {
                // Placeholder — GET /v1/users/me/data not yet exposed in api-client.
                window.alert(
                  'Tính năng xuất dữ liệu sẽ có sau khi backend mở endpoint /v1/users/me/data.',
                );
              }}
              onDelete={async () => {
                // Placeholder — DELETE /v1/users/me/data not yet exposed.
                window.alert(
                  'Yêu cầu xoá dữ liệu đã ghi nhận. Backend endpoint sẽ xử lý ở Phase 2.',
                );
              }}
            />
          )}
        </section>
      </div>
    </main>
  );
}

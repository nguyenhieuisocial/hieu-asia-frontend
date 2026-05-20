'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, InsightCard } from '@hieu-asia/ui';
import { TgMainButton } from '@/components/tg-main-button';
import { TgBackButton } from '@/components/tg-back-button';
import type { InsightItem } from '@hieu-asia/types';

/** Mini App report uses MOCK data identical in spirit to web's mock. */
const MOCK_STRENGTHS: InsightItem[] = [
  {
    title: 'Tầm nhìn xa',
    assessment: 'Bạn nhìn được pattern + cơ hội 12–24 tháng tới sớm hơn người khác.',
    action: 'Đặt 1 giờ / tuần ghi 3 dự đoán + theo dõi xác suất đúng. Sau 8 tuần, calibrate.',
  },
  {
    title: 'Năng lượng dấn thân',
    assessment: 'Cao bất thường khi có mục tiêu rõ. Đa số bị "lưng chừng" khi mục tiêu mơ hồ.',
    risk: 'Dễ kiệt sức nếu duy trì >6 tuần không nghỉ.',
    action: 'Plan cycle 6 tuần work / 1 tuần reset. Đặt deadline cứng.',
  },
];

const MOCK_BLIND: InsightItem[] = [
  {
    title: 'Phân quyền chậm',
    assessment: 'Bạn tin "tự làm sẽ chắc nhất" — đúng ngắn hạn, sai dài hạn cho scale.',
    risk: 'Bottleneck team ở quyết định bạn cần ra.',
    action: 'Liệt kê 5 quyết định gần nhất bạn ra → 2 cái nào có thể delegate? Bắt đầu từ đó.',
  },
];

const MOCK_PLAN_30 = [
  'Họp 1:1 từng team trưởng, thống nhất 1–2 KPI / người.',
  'Lên dashboard tài chính tuần (revenue / cash / burn).',
  'Ghi nhật ký quyết định 5 phút mỗi tối.',
];

type Tab = 'overview' | 'strengths' | 'blind' | 'plan';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'strengths', label: 'Điểm mạnh' },
  { id: 'blind', label: 'Điểm mù' },
  { id: 'plan', label: '30 ngày' },
];

export default function MiniAppReportPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const readingId = params.id;
  const [tab, setTab] = React.useState<Tab>('overview');

  return (
    <main className="min-h-screen px-4 pb-32 pt-3">
      <TgBackButton onBack={() => router.push('/dashboard')} fallbackLabel="Dashboard" />

      <div className="mx-auto max-w-md pt-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Báo cáo · {readingId.slice(0, 12)}</p>
        <h1 className="mt-1 font-heading text-xl font-semibold text-cream">Cẩm Nang Cuộc Đời</h1>

        <Card className="mt-3 border-jade/30 bg-jade/5">
          <CardHeader>
            <CardDescription className="text-xs text-jade-50">
              Báo cáo mang tính tham khảo, định hướng hành động — không phải tiên đoán định mệnh.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tab pill bar */}
        <div className="mt-4 overflow-x-auto">
          <nav className="flex gap-1 border-b border-gold/15 pb-1" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs ${
                  tab === t.id ? 'bg-gold/15 text-gold' : 'text-cream/65 hover:text-cream'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <section role="tabpanel" className="mt-4 space-y-3">
          {tab === 'overview' && <OverviewPanel />}
          {tab === 'strengths' && MOCK_STRENGTHS.map((i, idx) => <InsightCard key={idx} insight={i} />)}
          {tab === 'blind' && MOCK_BLIND.map((i, idx) => <InsightCard key={idx} insight={i} />)}
          {tab === 'plan' && <PlanPanel />}
        </section>
      </div>

      <TgMainButton text="Mở Mentor →" onClick={() => router.push(`/reading/${readingId}/mentor`)} />
    </main>
  );
}

function OverviewPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bản chất cốt lõi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-cream/85">
        <p>
          Bạn là <strong className="text-gold">người tiên phong có hệ thống</strong> — nhìn xa nhưng không
          mơ mộng. Ra quyết định nhanh khi có dữ liệu, nhưng dễ bị mắc kẹt khi cảm xúc lấn át.
        </p>
        <p>
          Năm nay là giai đoạn <strong className="text-gold">củng cố nền tảng</strong>. Hạn chế mở rộng,
          tập trung tối ưu cấu trúc team + dòng tiền.
        </p>
      </CardContent>
    </Card>
  );
}

function PlanPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hành động 30 ngày</CardTitle>
        <CardDescription>Bắt đầu sớm, đo lường mỗi tuần.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {MOCK_PLAN_30.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 font-mono text-xs text-gold">
                {i + 1}
              </span>
              <span className="text-cream/90">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

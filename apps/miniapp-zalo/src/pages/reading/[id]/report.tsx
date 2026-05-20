import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@hieu-asia/ui';
import { ZaloHeader } from '../../../components/zalo-header';
import { InsightCard } from '../../../components/insight-card';
import { shareReport } from '../../../lib/zalo-share';

const TABS = [
  { id: 'overview', label: 'Bản chất' },
  { id: 'strengths', label: 'Điểm mạnh' },
  { id: 'blind', label: 'Điểm mù' },
  { id: 'career', label: 'Sự nghiệp' },
  { id: 'finance', label: 'Tài chính' },
  { id: 'relations', label: 'Quan hệ' },
  { id: 'forecast', label: 'Dự báo năm' },
  { id: 'plan90', label: '30-60-90' },
  { id: 'prompts', label: 'Hỏi Mentor' },
] as const;

type TabId = (typeof TABS)[number]['id'];

// Compact mock plan — full schema in @hieu-asia/types StrategicActionPlan.
const MOCK = {
  overview: {
    title: 'Người hành động quyết liệt',
    insight: 'Bạn quyết định nhanh, ưu tiên tốc độ hơn độ chắc chắn tuyệt đối.',
  },
  strengths: [
    { title: 'Sức bật khởi sự', insight: 'Vào việc nhanh, không bị tê liệt bởi phân tích quá mức.', action: 'Phân công cho mình các giai đoạn khởi tạo / breakthrough.' },
  ],
  blind: [
    { title: 'Áp lực lên đội nhóm', insight: 'Tốc độ của bạn dễ trở thành áp lực ngầm cho cộng sự.', risk: 'Cộng sự burnout / nghỉ việc đột ngột.', action: 'Mỗi tuần dành 30 phút check-in 1:1, hỏi cảm nhận, không hỏi tiến độ.' },
  ],
  career: [
    { title: 'Sự nghiệp', insight: 'Phù hợp các vai trò leader, founder, hoặc growth role.', action: 'Tránh các role thuần vận hành lặp lại trong 12 tháng tới.' },
  ],
  finance: [
    { title: 'Dòng tiền', insight: 'Bạn dễ "all-in" khi nhìn thấy cơ hội — cần guardrail.', risk: 'Cạn dòng tiền khi cơ hội không nở.', action: 'Quy ước: không quá 30% cash flow vào 1 cơ hội mới trong 90 ngày.' },
  ],
  relations: [
    { title: 'Đội nhóm', insight: 'Bạn kéo team đi nhanh nhưng dễ bỏ qua tín hiệu xung đột âm thầm.', action: 'Set up retro hai tuần một lần — chỉ về relationships, không về task.' },
  ],
  forecast: [
    { title: 'Năm hiện tại', insight: 'Cửa sổ thuận lợi tháng 6-8 cho mở rộng; rủi ro tài chính tháng 10-11.', action: 'Khoá quyết định lớn vào tháng 6-7; bảo toàn dòng tiền cho Q4.' },
  ],
  plan90: [
    { title: '30 ngày', insight: 'Ổn định team & dòng tiền', action: 'Audit chi tiêu, retro với 3 nhân sự chủ chốt.' },
    { title: '60 ngày', insight: 'Khoá 1 kênh tăng trưởng', action: 'Chọn 1 kênh, đầu tư đủ ngân sách 60 ngày, dừng các kênh phụ.' },
    { title: '90 ngày', insight: 'Review & tái cấu trúc', action: 'Quyết định scale hoặc pivot dựa trên data 60 ngày.' },
  ],
  prompts: [
    'Tôi nên xử lý nhân sự chống đối thế nào?',
    'Có nên mở chi nhánh thứ 4 trong quý này?',
    'Điểm mù lớn nhất của tôi là gì?',
  ],
} as const;

export function ReportPage() {
  const navigate = useNavigate();
  const { id: readingId = '' } = useParams<{ id: string }>();
  const [tab, setTab] = useState<TabId>('overview');

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return <InsightCard title={MOCK.overview.title} insight={MOCK.overview.insight} />;
      case 'strengths':
        return MOCK.strengths.map((s) => <InsightCard key={s.title} {...s} />);
      case 'blind':
        return MOCK.blind.map((s) => <InsightCard key={s.title} {...s} />);
      case 'career':
        return MOCK.career.map((s) => <InsightCard key={s.title} {...s} />);
      case 'finance':
        return MOCK.finance.map((s) => <InsightCard key={s.title} {...s} />);
      case 'relations':
        return MOCK.relations.map((s) => <InsightCard key={s.title} {...s} />);
      case 'forecast':
        return MOCK.forecast.map((s) => <InsightCard key={s.title} {...s} />);
      case 'plan90':
        return MOCK.plan90.map((s) => <InsightCard key={s.title} {...s} />);
      case 'prompts':
        return (
          <ul className="space-y-2">
            {MOCK.prompts.map((p) => (
              <li
                key={p}
                className="rounded-md border border-gold/15 bg-ink/40 px-3 py-2 text-sm text-cream/85"
              >
                {p}
              </li>
            ))}
          </ul>
        );
    }
  };

  return (
    <main className="min-h-screen bg-ink-radial pb-32">
      <ZaloHeader title="Báo cáo của bạn" backTo="/dashboard" />
      <nav className="-mx-1 flex gap-2 overflow-x-auto px-4 pt-3" aria-label="Mục báo cáo">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              'shrink-0 rounded-full border px-3 py-1.5 text-xs ' +
              (tab === t.id
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-gold/15 text-cream/70')
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="space-y-3 px-4 pt-4">{renderTab()}</section>

      <div className="zalo-safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-gold/15 bg-ink/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => void shareReport(window.location.href)}
          >
            Chia sẻ
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/reading/${readingId}/mentor`)}>
            Chat với Mentor →
          </Button>
        </div>
      </div>
    </main>
  );
}

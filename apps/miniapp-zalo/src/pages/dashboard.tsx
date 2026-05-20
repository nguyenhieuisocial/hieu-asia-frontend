import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ZaloHeader } from '../components/zalo-header';
import { purchaseReading } from '../lib/zalo-payment';

interface ReportRow {
  id: string;
  date: string;
  primary_concern: string;
}

const MOCK_REPORTS: ReportRow[] = [
  { id: 'demo-task-001', date: '20/05/2026', primary_concern: 'Dòng tiền căng + middle manager chống đối' },
  { id: 'demo-task-002', date: '12/03/2026', primary_concern: 'Có nên mở chi nhánh thứ 4?' },
];

export function DashboardPage() {
  const navigate = useNavigate();

  const onPurchase = async () => {
    const res = await purchaseReading();
    if (res.mock) {
      window.alert('Thanh toán mock: ' + res.orderId);
    } else {
      window.alert('Đã tạo đơn ' + res.orderId);
    }
  };

  return (
    <main className="min-h-screen bg-ink-radial pb-10">
      <ZaloHeader title="Bảng điều khiển" backTo="/" />
      <section className="space-y-4 px-4 pt-5">
        <Card>
          <CardHeader>
            <CardTitle>Báo cáo của tôi</CardTitle>
            <CardDescription>Bấm để xem lại hoặc chat tiếp với Mentor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_REPORTS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => navigate(`/reading/${r.id}/report`)}
                className="w-full rounded-md border border-gold/15 bg-ink/40 px-3 py-3 text-left transition-colors hover:border-gold/40"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/40">
                  {r.date}
                </p>
                <p className="mt-1 text-sm text-cream/90">{r.primary_concern}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gói &amp; lượt dùng</CardTitle>
            <CardDescription>Mentor đã hỏi 17 / 60 trong tháng này.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={onPurchase}>
              Mua thêm báo cáo (99.000đ)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quyền riêng tư</CardTitle>
            <CardDescription>Bạn kiểm soát mọi dữ liệu cá nhân.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.alert('Yêu cầu xuất dữ liệu đã ghi nhận (Phase 2).')}
            >
              Xuất dữ liệu của tôi
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.alert('Yêu cầu xoá dữ liệu đã ghi nhận (Phase 2).')}
            >
              Xoá toàn bộ dữ liệu
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

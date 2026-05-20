import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = { title: 'Bảng điều khiển' };

export default function DashboardPage() {
  return (
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-6 font-heading text-3xl text-cream">Bảng điều khiển của bạn</h1>
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo đã mua</CardTitle>
          <CardDescription>Danh sách báo cáo, lịch sử chat Mentor và gói đang dùng.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cream/60">(Skeleton — Phase 2.)</p>
        </CardContent>
      </Card>
    </main>
  );
}

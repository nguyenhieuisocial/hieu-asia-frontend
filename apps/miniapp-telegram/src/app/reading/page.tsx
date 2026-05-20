import { Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';

export const metadata = { title: 'Tạo báo cáo' };

export default function ReadingPage() {
  return (
    <main className="min-h-screen px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Tạo báo cáo mới</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cream/60">(Skeleton — Phase 3.)</p>
        </CardContent>
      </Card>
    </main>
  );
}

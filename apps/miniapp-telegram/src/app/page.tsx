import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';

export default function MiniAppHome() {
  return (
    <main className="min-h-screen px-4 py-6">
      <h1 className="font-heading text-2xl text-gold">hieu.asia</h1>
      <p className="mt-1 text-sm text-cream/70">Cẩm Nang Cuộc Đời AI · Mini App</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bắt đầu</CardTitle>
          <CardDescription>Chạm để tạo báo cáo cá nhân hoá đầu tiên của bạn.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild={false} className="w-full">
            <Link href="/reading">Tạo báo cáo mới</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Mentor</CardTitle>
          <CardDescription>Trò chuyện với cố vấn AI từ báo cáo gần nhất.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild={false} className="w-full">
            <Link href="/mentor">Mở Mentor</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
